import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaFileCsv, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsAPI
      .getData()
      .then((res) => setReport(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCsvExport = async () => {
    try {
      const res = await reportsAPI.getCsv();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ddos-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Failed to export CSV');
    }
  };

  const handlePdfExport = () => {
    if (!report) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(5, 8, 22);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(124, 58, 237);
    doc.setFontSize(20);
    doc.text('DDoS Protection Report', 14, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let y = 55;

    const lines = [
      `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
      `Date: ${report.date}`,
      '',
      '--- Summary ---',
      `Total Requests: ${report.totalRequests}`,
      `Attack Count: ${report.attackCount}`,
      `Blocked Requests: ${report.blockedRequests}`,
      `Peak Traffic: ${report.peakTraffic}`,
      `Blocked IPs: ${report.blockedIps}`,
      '',
      '--- Threat Summary ---',
      `Status: ${report.threatSummary?.status}`,
      `Threat Level: ${report.threatSummary?.level}`,
      `Threat Score: ${report.threatSummary?.score}/100`,
    ];

    lines.forEach((line) => {
      doc.text(line, 14, y);
      y += 8;
    });

    if (report.threatSummary?.detections?.length) {
      y += 5;
      doc.text('Detections:', 14, y);
      y += 8;
      report.threatSummary.detections.forEach((d) => {
        doc.text(`- ${d.rule} (${d.severity})`, 18, y);
        y += 7;
      });
    }

    doc.save(`ddos-report-${Date.now()}.pdf`);
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-cyber-purple border-t-cyber-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Reports</h1>
        <p className="text-gray-400 mb-8">Generate and download security reports</p>

        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={handlePdfExport} className="btn-primary flex items-center gap-2">
            <FaFilePdf /> Export PDF
          </button>
          <button onClick={handleCsvExport} className="btn-outline flex items-center gap-2">
            <FaFileCsv /> Export CSV
          </button>
        </div>

        {report && (
          <div className="neon-card rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <FaDownload className="text-cyber-cyan text-xl" />
              <h2 className="text-xl font-bold">Report Preview</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="glass rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="font-semibold">{report.date}</p>
                </div>
                <div className="glass rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Requests</p>
                  <p className="text-2xl font-bold text-cyber-cyan">{report.totalRequests}</p>
                </div>
                <div className="glass rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Attack Count</p>
                  <p className="text-2xl font-bold text-red-400">{report.attackCount}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Blocked Requests</p>
                  <p className="text-2xl font-bold text-orange-400">{report.blockedRequests}</p>
                </div>
                <div className="glass rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Peak Traffic</p>
                  <p className="text-2xl font-bold text-cyber-purple">{report.peakTraffic}</p>
                </div>
                <div className="glass rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Threat Summary</p>
                  <p className={`font-bold ${
                    report.threatSummary?.status === 'SAFE' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {report.threatSummary?.status} — {report.threatSummary?.level}
                  </p>
                  <p className="text-sm text-gray-400">Score: {report.threatSummary?.score}/100</p>
                </div>
              </div>
            </div>

            {report.threatSummary?.detections?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-3">Active Detections</h3>
                <div className="space-y-2">
                  {report.threatSummary.detections.map((d) => (
                    <div key={d.rule} className="flex justify-between glass rounded-lg p-3">
                      <span>{d.rule}</span>
                      <span className={`text-xs px-2 py-1 rounded border severity-${d.severity.toLowerCase()}`}>
                        {d.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Reports;
