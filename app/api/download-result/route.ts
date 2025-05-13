import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import jsPDF from "jspdf";

interface ChartImageData {
  image: string;
  aspectRatio: number;
  width: number;
  height: number;
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { id, chartImage, calc_log } = requestData;

    // Parse chart image data if it's a JSON string
    let imageData: ChartImageData | null = null;
    let imageToUse = chartImage;
    
    if (chartImage && typeof chartImage === 'string') {
      try {
        if (chartImage.startsWith('{')) {
          // This is JSON string containing image and aspect ratio
          const parsedData = JSON.parse(chartImage);
          if (parsedData && typeof parsedData === 'object' && 'image' in parsedData) {
            imageData = parsedData as ChartImageData;
            imageToUse = imageData.image;
          }
        }
      } catch (parseError) {
        console.error("Error parsing chart image data:", parseError);
        // Continue with original chartImage if parsing fails
      }
    }

    // Fetch project data
    const { data: project, error } = await supabase
      .from("project")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create PDF document using jsPDF - use A4 size
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    // Add content to PDF
    doc.setFontSize(25);
    doc.text("LCA Result Report", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text(`Project: ${project.title}`, 20, 40);
    
    doc.setFontSize(14);
    doc.text(`Total CO2: ${project.result} ${project.result_unit} CO2e`, 20, 50);
    
    // Add chart image if available
    let currentYPosition = 60;
    
    if (imageToUse) {
      try {
        // Get PDF page dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const usableWidth = pageWidth - 40; // 20mm margins on each side
        
        // Calculate image dimensions to match the browser's aspect ratio exactly
        let imageWidth = usableWidth;
        let imageHeight;
        
        if (imageData && imageData.aspectRatio) {
          // Use the exact aspect ratio from the browser
          imageHeight = imageWidth * imageData.aspectRatio;
          
          // If image would be too tall, scale it down but maintain aspect ratio
          const maxImageHeight = 100; // reduced max height to accommodate calculation logs
          if (imageHeight > maxImageHeight) {
            imageHeight = maxImageHeight;
            imageWidth = imageHeight / imageData.aspectRatio;
          }
        } else {
          // Fallback if no aspect ratio data
          imageHeight = imageWidth * 0.56; // default aspect ratio
        }
        
        // Center the image horizontally
        const leftMargin = (pageWidth - imageWidth) / 2;
        
        // Add chart image to PDF with exact dimensions from browser
        doc.addImage(imageToUse, 'PNG', leftMargin, currentYPosition, imageWidth, imageHeight);
        
        // Update Y position for next content
        currentYPosition += imageHeight + 10;
        
      } catch (imgError) {
        console.error("Error adding chart image to PDF:", imgError);
        // If image addition fails, just continue with logs below
      }
    }
    
    // Add calculation logs if available
    if (calc_log && typeof calc_log === 'object') {
      // Add calculation log title
      doc.setFontSize(14);
      doc.text("Calculation Details", 20, currentYPosition);
      currentYPosition += 8;
      
      // Loop through each calculation category
      const categories = Object.keys(calc_log);
      
      for (const category of categories) {
        // Check for page overflow and add new page if needed
        if (currentYPosition > 250) {
          doc.addPage();
          currentYPosition = 20;
        }
        
        // Add category title
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(category, 20, currentYPosition);
        currentYPosition += 6;
        
        // Add category logs
        doc.setFontSize(9);
        
        // Handle different formats of calculation logs
        if (Array.isArray(calc_log[category])) {
          for (const line of calc_log[category]) {
            // Check for page overflow and add new page if needed
            if (currentYPosition > 270) {
              doc.addPage();
              currentYPosition = 20;
            }
            
            doc.text(line, 25, currentYPosition);
            currentYPosition += 4.5;
          }
        } else if (typeof calc_log[category] === 'string') {
          doc.text(calc_log[category], 25, currentYPosition);
          currentYPosition += 4.5;
        }
        
        currentYPosition += 3; // Add spacing between categories
      }
    }
    
    // Add details section
    // Check for page overflow and add new page if needed
    if (currentYPosition > 240) {
      doc.addPage();
      currentYPosition = 20;
    }
    
    // Add timestamp at the bottom
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);

    // Get PDF as buffer (or in this case, a Uint8Array)
    const pdfBuffer = doc.output('arraybuffer');

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="lca-result-${project.title}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
