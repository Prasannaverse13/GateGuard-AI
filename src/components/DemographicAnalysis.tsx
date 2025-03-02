import React from 'react';
import { Users, UserCheck, Globe } from 'lucide-react';
import { useAIContext } from '../context/AIContext';

const DemographicAnalysis: React.FC = () => {
  const { demographicData } = useAIContext();
  
  return (
    <div className="bento-card overflow-hidden">
      <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="font-semibold">Audience Demographics</h2>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gender Distribution */}
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <UserCheck className="h-4 w-4 mr-2 text-blue-400" />
              Gender Distribution
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Male</span>
                  <span>{demographicData.gender.male}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${demographicData.gender.male}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Female</span>
                  <span>{demographicData.gender.female}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${demographicData.gender.female}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Other</span>
                  <span>{demographicData.gender.other}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${demographicData.gender.other}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Age Distribution */}
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-400" />
              Age Distribution
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Under 18</span>
                  <span>{Math.round(demographicData.age.under18)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${demographicData.age.under18}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>18-24</span>
                  <span>{Math.round(demographicData.age.age18to24)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${demographicData.age.age18to24}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>25-34</span>
                  <span>{Math.round(demographicData.age.age25to34)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${demographicData.age.age25to34}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>35-44</span>
                  <span>{Math.round(demographicData.age.age35to44)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${demographicData.age.age35to44}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>45-54</span>
                  <span>{Math.round(demographicData.age.age45to54)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${demographicData.age.age45to54}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>55+</span>
                  <span>{Math.round(demographicData.age.age55plus)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${demographicData.age.age55plus}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Nationality */}
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Globe className="h-4 w-4 mr-2 text-blue-400" />
              Nationality
            </h3>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${demographicData.nationality.domestic}, 100`}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold">{Math.round(demographicData.nationality.domestic)}%</div>
                  <div className="text-xs text-gray-400">Domestic</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm">International: {Math.round(demographicData.nationality.international)}%</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Data is analyzed in real-time from camera feeds using AI facial recognition and pattern analysis.
        </div>
      </div>
    </div>
  );
};

export default DemographicAnalysis;