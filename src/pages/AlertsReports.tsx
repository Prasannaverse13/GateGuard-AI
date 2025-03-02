import React, { useState } from 'react';
import { Bell, Calendar, Filter, Download, ChevronDown } from 'lucide-react';
import { useAlertContext } from '../context/AlertContext';
import AlertsList from '../components/AlertsList';
import DateRangePicker from '../components/DateRangePicker';
import AlertTypeChart from '../components/AlertTypeChart';
import AlertTimelineChart from '../components/AlertTimelineChart';

const AlertsReports: React.FC = () => {
  const { alerts } = useAlertContext();
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    end: new Date()
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>(['high', 'medium', 'low']);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['anomaly', 'intrusion', 'crowd']);
  
  // Filter alerts based on selected criteria
  const filteredAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.timestamp);
    const isInDateRange = alertDate >= dateRange.start && alertDate <= dateRange.end;
    const matchesSeverity = selectedSeverity.includes(alert.severity);
    const matchesType = selectedTypes.includes(alert.type);
    
    return isInDateRange && matchesSeverity && matchesType;
  });

  const toggleSeverity = (severity: string) => {
    if (selectedSeverity.includes(severity)) {
      setSelectedSeverity(selectedSeverity.filter(s => s !== severity));
    } else {
      setSelectedSeverity([...selectedSeverity, severity]);
    }
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alerts & Reports</h1>
          <p className="text-gray-400">Security event logs and analytics</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-3 py-1.5 rounded-lg flex items-center bg-gray-700 hover:bg-gray-600"
          >
            <Filter className="h-4 w-4 mr-1" />
            <span>Filter</span>
          </button>
          <button className="px-3 py-1.5 rounded-lg flex items-center bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-1" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Date Range
              </h3>
              <DateRangePicker
                startDate={dateRange.start}
                endDate={dateRange.end}
                onChange={setDateRange}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Severity</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSeverity.includes('high')}
                    onChange={() => toggleSeverity('high')}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="ml-2 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    High
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSeverity.includes('medium')}
                    onChange={() => toggleSeverity('medium')}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="ml-2 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                    Medium
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSeverity.includes('low')}
                    onChange={() => toggleSeverity('low')}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="ml-2 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                    Low
                  </span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Alert Type</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes('anomaly')}
                    onChange={() => toggleType('anomaly')}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="ml-2">Anomaly Detection</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes('intrusion')}
                    onChange={() => toggleType('intrusion')}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="ml-2">Intrusion</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes('crowd')}
                    onChange={() => toggleType('crowd')}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="ml-2">Crowd Density</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold">Alert Timeline</h2>
          </div>
          <div className="p-4 h-64">
            <AlertTimelineChart alerts={filteredAlerts} dateRange={dateRange} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold">Alert Types</h2>
          </div>
          <div className="p-4 h-64">
            <AlertTypeChart alerts={filteredAlerts} />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold flex items-center">
            <Bell className="h-5 w-5 mr-2 text-yellow-500" />
            Alert Log
          </h2>
          <div className="flex items-center text-sm text-gray-400">
            <span>Showing {filteredAlerts.length} alerts</span>
            <button className="ml-2 p-1 rounded hover:bg-gray-700">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div>
          <AlertsList alerts={filteredAlerts} />
        </div>
      </div>
    </div>
  );
};

export default AlertsReports;