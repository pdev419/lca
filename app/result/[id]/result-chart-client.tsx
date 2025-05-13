"use client";

import { weightToKg } from "@/app/utils/convert_unit";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useRef, forwardRef, useImperativeHandle } from "react";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface ResultChartProps {
  calculation: any;
}

export interface ChartMethods {
  getChartImage: () => Promise<string | null>;
}

const ResultChartClient = forwardRef<ChartMethods, ResultChartProps>(
  ({ calculation }, ref) => {
    const pieChartRef = useRef<any>(null);
    const barChartRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Expose the getChartImage method to parent components
    useImperativeHandle(ref, () => ({
      getChartImage: async () => {
        if (
          !pieChartRef.current ||
          !barChartRef.current ||
          !containerRef.current
        ) {
          return null;
        }

        try {
          // Get the container and its computed style
          const container = containerRef.current;
          const containerRect = container.getBoundingClientRect();
          const containerWidth = containerRect.width;
          const containerHeight = containerRect.height;

          // Use html2canvas to capture the entire container exactly as it appears
          // But for now, we'll create a canvas that matches the exact dimensions
          const tempCanvas = document.createElement("canvas");
          const ctx = tempCanvas.getContext("2d");

          if (!ctx) return null;

          // We'll match the exact pixel dimensions we see in the browser
          tempCanvas.width = containerWidth * 2; // 2x for higher resolution
          tempCanvas.height = containerHeight * 2; // 2x for higher resolution

          // Scale the context to match our higher resolution
          ctx.scale(2, 2);

          // Fill with white background
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, containerWidth, containerHeight);

          // Get computed layout - using the actual browser layout
          const isDesktopLayout =
            window.getComputedStyle(container).flexDirection !== "column";

          // Get all elements in container
          const pieContainer = container.children[0] as HTMLElement;
          const barContainer = container.children[1] as HTMLElement;

          // Get the actual positions and sizes from the DOM
          const pieRect = pieContainer.getBoundingClientRect();
          const barRect = barContainer.getBoundingClientRect();

          // Get chart canvases
          const pieCanvas = pieChartRef.current.canvas;
          const barCanvas = barChartRef.current.canvas;

          if (isDesktopLayout) {
            // Side by side layout (desktop)
            const pieLeft = pieRect.left - containerRect.left;
            const pieTop = pieRect.top - containerRect.top;
            const barLeft = barRect.left - containerRect.left;
            const barTop = barRect.top - containerRect.top;

            // Draw charts at their exact positions
            ctx.drawImage(
              pieCanvas,
              pieLeft,
              pieTop,
              pieRect.width,
              pieRect.height
            );
            ctx.drawImage(
              barCanvas,
              barLeft,
              barTop,
              barRect.width,
              barRect.height
            );
          } else {
            // Stacked layout (mobile)
            const pieLeft = pieRect.left - containerRect.left;
            const pieTop = pieRect.top - containerRect.top;
            const barLeft = barRect.left - containerRect.left;
            const barTop = barRect.top - containerRect.top;

            // Draw charts at their exact positions
            ctx.drawImage(
              pieCanvas,
              pieLeft,
              pieTop,
              pieRect.width,
              pieRect.height
            );
            ctx.drawImage(
              barCanvas,
              barLeft,
              barTop,
              barRect.width,
              barRect.height
            );
          }

          // Create metadata with exact dimensions
          const imageData = {
            image: tempCanvas.toDataURL("image/png", 1.0), // Use maximum quality
            aspectRatio: containerHeight / containerWidth,
            width: containerWidth,
            height: containerHeight,
          };

          // Return the image with its exact metadata
          return JSON.stringify(imageData);
        } catch (error) {
          console.error("Error capturing charts:", error);

          // Fallback to just the pie chart if merging fails
          if (pieChartRef.current) {
            return pieChartRef.current.toBase64Image();
          }
          return null;
        }
      },
    }));

    const labels = ["Materials", "Transport", "Energy", "Waste"];
    const dataValues = [
      calculation.materialWeight,
      calculation.transportWeight,
      calculation.energyWeight,
      calculation.wasteQuantity,
    ];

    // Pie chart data
    const pieData = {
      labels,
      datasets: [
        {
          label: "kg CO₂e",
          data: dataValues,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // Bar chart data
    const barData = {
      labels,
      datasets: [
        {
          label: "kg CO₂e",
          data: dataValues,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
          ],
          barThickness: 20,
          maxBarThickness: 30,
          barPercentage: 0.5,
          categoryPercentage: 0.7,
        },
      ],
    };

    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right" as const,
          align: "center" as const,
          labels: {
            boxWidth: 15,
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
        title: {
          display: false,
        },
      },
    };

    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y" as const,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
          border: {
            display: false,
          },
        },
      },
    };

    return (
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col md:flex-row gap-4 items-center justify-center"
      >
        <div className="w-full md:w-1/2 h-72">
          <Pie data={pieData} options={pieOptions} ref={pieChartRef} />
        </div>
        <div className="w-sm md:w-1/2 h-72">
          <Bar data={barData} options={barOptions} ref={barChartRef} />
        </div>
      </div>
    );
  }
);

ResultChartClient.displayName = "ResultChartClient";

export default ResultChartClient;
