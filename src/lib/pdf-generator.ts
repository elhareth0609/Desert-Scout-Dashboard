import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface FlightData {
  id: string;
  description: string;
  status: string;
  startTime: string | Date;
  duration?: number;
  area?: string;
  detections?: number;
}

export const generateFlightReport = async (flight: FlightData): Promise<void> => {
  // Create a temporary container for the report content
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "210mm";
  container.style.padding = "20px";
  container.style.backgroundColor = "#1a1a1a";
  container.style.color = "#ffffff";
  container.style.fontFamily = "Inter, sans-serif";

  // Format the flight date
  const flightDate = new Date(flight.startTime);
  const formattedDate = flightDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = flightDate.toLocaleTimeString("en-US");

  // Generate mock detection data
  const mockDetections = Math.floor(Math.random() * 15) + 5;
  const mockThreatLevel = ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)];

  // Create the HTML content
  container.innerHTML = `
    <div style="margin-bottom: 30px; border-bottom: 2px solid #ff6b35; padding-bottom: 15px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <img src="/images/logo.png" alt="Desert Scout Logo" style="max-height: 60px; width: auto;">
        <div style="text-align: right; font-size: 10px; color: #999;">
          <p style="margin: 0;">MISSION REPORT</p>
          <p style="margin: 5px 0 0 0;">${new Date().toLocaleDateString()}</p>
        </div>
      </div>
      <h1 style="margin: 15px 0 0 0; font-size: 28px; font-weight: bold; color: #ff6b35;">
        DESERT SCOUT
      </h1>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #999; letter-spacing: 2px;">
        AUTONOMOUS INTELLIGENCE · ALGERIAN SAHARA
      </p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #ff6b35; letter-spacing: 1px;">
        FLIGHT INFORMATION
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 10px; background: #222; font-weight: bold; color: #ff6b35; width: 30%;">Flight ID:</td>
          <td style="padding: 10px; background: #1a1a1a;">${flight.id}</td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 10px; background: #222; font-weight: bold; color: #ff6b35;">Date:</td>
          <td style="padding: 10px; background: #1a1a1a;">${formattedDate}</td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 10px; background: #222; font-weight: bold; color: #ff6b35;">Time:</td>
          <td style="padding: 10px; background: #1a1a1a;">${formattedTime}</td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 10px; background: #222; font-weight: bold; color: #ff6b35;">Status:</td>
          <td style="padding: 10px; background: #1a1a1a; color: ${
            flight.status === "completed" ? "#22c55e" : flight.status === "ongoing" ? "#3b82f6" : "#ef4444"
          }; font-weight: bold; text-transform: uppercase;">
            ${flight.status}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 10px; background: #222; font-weight: bold; color: #ff6b35;">Description:</td>
          <td style="padding: 10px; background: #1a1a1a;">${flight.description || "N/A"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 10px; background: #222; font-weight: bold; color: #ff6b35;">Duration:</td>
          <td style="padding: 10px; background: #1a1a1a;">${flight.duration || "45"} minutes</td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 10px; background: #222; font-weight: bold; color: #ff6b35;">Survey Area:</td>
          <td style="padding: 10px; background: #1a1a1a;">${flight.area || "Sector 7 - Algerian Sahara"}</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #ff6b35; letter-spacing: 1px;">
        DETECTION SUMMARY
      </h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        <div style="background: #222; padding: 15px; border-left: 3px solid #ff6b35;">
          <div style="font-size: 24px; font-weight: bold; color: #ff6b35; margin-bottom: 5px;">
            ${mockDetections}
          </div>
          <div style="font-size: 11px; color: #999; letter-spacing: 1px;">TOTAL DETECTIONS</div>
        </div>
        <div style="background: #222; padding: 15px; border-left: 3px solid ${mockThreatLevel === "HIGH" ? "#ef4444" : mockThreatLevel === "MEDIUM" ? "#f59e0b" : "#22c55e"};">
          <div style="font-size: 24px; font-weight: bold; color: ${mockThreatLevel === "HIGH" ? "#ef4444" : mockThreatLevel === "MEDIUM" ? "#f59e0b" : "#22c55e"}; margin-bottom: 5px;">
            ${mockThreatLevel}
          </div>
          <div style="font-size: 11px; color: #999; letter-spacing: 1px;">THREAT LEVEL</div>
        </div>
        <div style="background: #222; padding: 15px; border-left: 3px solid #3b82f6;">
          <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 5px;">
            ${Math.floor(Math.random() * 100) + 80}%
          </div>
          <div style="font-size: 11px; color: #999; letter-spacing: 1px;">COVERAGE</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #ff6b35; letter-spacing: 1px;">
        DETECTIONS LOG
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <thead>
          <tr style="background: #222; border-bottom: 2px solid #ff6b35;">
            <th style="padding: 10px; text-align: left; color: #ff6b35; font-weight: bold; letter-spacing: 1px;">#</th>
            <th style="padding: 10px; text-align: left; color: #ff6b35; font-weight: bold; letter-spacing: 1px;">TYPE</th>
            <th style="padding: 10px; text-align: left; color: #ff6b35; font-weight: bold; letter-spacing: 1px;">TIME</th>
            <th style="padding: 10px; text-align: left; color: #ff6b35; font-weight: bold; letter-spacing: 1px;">CONFIDENCE</th>
          </tr>
        </thead>
        <tbody>
          ${Array.from({ length: Math.min(mockDetections, 8) })
            .map((_, i) => {
              const detectionTime = new Date(flightDate.getTime() + i * 300000).toLocaleTimeString();
              const types = ["Vehicle", "Personnel", "Structure", "Anomaly", "Equipment"];
              const type = types[Math.floor(Math.random() * types.length)];
              const confidence = Math.floor(Math.random() * 40) + 60;
              return `
                <tr style="border-bottom: 1px solid #333; background: ${i % 2 === 0 ? "#1a1a1a" : "#222"};">
                  <td style="padding: 10px; color: #ff6b35; font-weight: bold;">${i + 1}</td>
                  <td style="padding: 10px;">${type}</td>
                  <td style="padding: 10px; color: #999;">${detectionTime}</td>
                  <td style="padding: 10px; color: #22c55e; font-weight: bold;">${confidence}%</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>

    <div style="border-top: 2px solid #ff6b35; padding-top: 15px; font-size: 10px; color: #999;">
      <p style="margin: 0 0 10px 0;">
        <strong style="color: #ff6b35;">REPORT STATUS:</strong> Automatically Generated Mission Report
      </p>
      <p style="margin: 0;">
        This report contains surveillance data and detection information. For official use only.
      </p>
      <p style="margin: 10px 0 0 0; letter-spacing: 1px;">
        Generated: ${new Date().toLocaleString()} | System: Desert Scout OS
      </p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#1a1a1a",
      logging: false,
    });

    // Create PDF from canvas
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add pages as needed
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    pdf.save(`Flight_Report_${flight.id}_${formattedDate.replace(/\s/g, "_")}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};
