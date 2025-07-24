

import React, { useMemo } from 'react';
import { calculateZScore } from '../services/qcCalculator';
import { WestgardRuleViolation, CumulativeDataPoint } from './types';

interface DataGraphProps {
  data: CumulativeDataPoint[];
  title: string;
  targetMean: number | null;
  observedMean: number | null;
  observedSD: number | null;
  westgardViolations: WestgardRuleViolation[];
  id?: string;
  isPdf?: boolean;
  width?: number;
  height?: number;
}

export const DataGraph: React.FC<DataGraphProps> = ({ 
    data, title, targetMean, observedMean, observedSD, westgardViolations, id, isPdf = false, width: propWidth, height: propHeight
}) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-500 italic my-3 text-center">No data points to plot.</p>;
  }

  const violationMap = useMemo(() => {
    const map = new Map<number, string>();
    if (westgardViolations) {
      westgardViolations.forEach(v => {
        if (!v.rule.includes('Warning')) {
          v.dataPointIndices?.forEach(idx => {
            if (!map.has(idx)) {
              map.set(idx, v.rule.replace('_', '').replace(' (Warning)', ''));
            }
          });
        }
      });
    }
    return map;
  }, [westgardViolations]);


  const dataPoints = data.map(d => d.value);

  const width = propWidth || 600;
  const height = propHeight || 350;
  const margin = { top: 30, right: 40, bottom: 80, left: 60 }; 
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  let yValuesToConsider: (number | null)[] = [...dataPoints, targetMean, observedMean];
  if (observedMean !== null && observedSD !== null && observedSD > 0) {
    for (let i = 1; i <= 3; i++) {
      yValuesToConsider.push(observedMean + i * observedSD);
      yValuesToConsider.push(observedMean - i * observedSD);
    }
  }
  const validYValues = yValuesToConsider.filter(v => v !== null && !isNaN(v)) as number[];
  
  if (validYValues.length === 0) {
      validYValues.push(...dataPoints);
  }

  const dataMin = Math.min(...validYValues);
  const dataMax = Math.max(...validYValues);
  const yRange = dataMax - dataMin;
  const yPadding = yRange === 0 ? 1 : yRange * 0.15;
  const effectiveYMin = dataMin - yPadding;
  const effectiveYMax = dataMax + yPadding;

  const xScale = (index: number) => margin.left + (dataPoints.length === 1 ? chartWidth / 2 : (index / (dataPoints.length - 1)) * chartWidth);
  const yScale = (value: number) => margin.top + chartHeight - ((value - effectiveYMin) / (effectiveYMax - effectiveYMin)) * chartHeight;

  const controlLines = [];
  if (targetMean !== null) controlLines.push({ value: targetMean, label: `Target Mean (${targetMean.toFixed(2)})`, color: '#d97706', dashArray: "6 3" });
  if (observedMean !== null) {
      controlLines.push({ value: observedMean, label: `Mean (${observedMean.toFixed(2)})`, color: '#10b981' });
      if (observedSD !== null && observedSD > 0) {
          for (let i = 1; i <= 3; i++) {
              controlLines.push({ value: observedMean + i * observedSD, label: `+${i}SD`, color: '#6b7280', opacity: i === 3 ? 0.9 : 0.6, dashArray: "3 3" });
              controlLines.push({ value: observedMean - i * observedSD, label: `-${i}SD`, color: '#6b7280', opacity: i === 3 ? 0.9 : 0.6, dashArray: "3 3" });
          }
      }
  }

  const linePath = dataPoints.length > 1 ? dataPoints.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ') : null;

  return (
    <div id={id} className={`mt-6 p-4 border rounded-lg shadow ${isPdf ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
      <h4 className={`text-lg font-semibold mb-3 text-center printable-hidden ${isPdf ? 'text-black' : 'text-gray-200'}`}>{title}</h4>
      <svg viewBox={`0 0 ${width} ${height}`} aria-labelledby="chart-title" role="img" className="w-full h-auto">
        <title id="chart-title">{title || "Levey-Jennings Chart"}</title>
        
        {/* Y-axis label */}
        <text
            transform="rotate(-90)"
            y={margin.left - 45}
            x={0 - (height / 2)}
            dy="1em"
            textAnchor="middle"
            fontSize="10px"
            fill={isPdf ? '#333' : '#9ca3af'}
        >
            Concentration
        </text>
        
        {controlLines.map(line => (
          <g key={line.label}>
            <line x1={margin.left} y1={yScale(line.value)} x2={width - margin.right} y2={yScale(line.value)} stroke={line.color} strokeWidth="1" strokeDasharray={line.dashArray} opacity={line.opacity}/>
            <text x={width - margin.right + 4} y={yScale(line.value) + 3} textAnchor="start" fontSize="8px" fill={line.color} fontWeight="medium">{line.label}</text>
          </g>
        ))}
        
        {/* X Axis Line */}
        <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke={isPdf ? '#374151' : '#d1d5db'} strokeWidth="1"/>
        
        {/* X Axis Date Labels */}
        {data.map((point, i) => {
            const x = xScale(i);
            const y = height - margin.bottom + 4;
            const dateLabel = new Date(point.date).toLocaleDateString('fa-IR-u-nu-latn', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            return (
                <g key={`x-label-${i}`}>
                    { (data.length < 20 || i % Math.floor(data.length / 15) === 0) &&
                      <text
                          x={x}
                          y={y}
                          transform={`rotate(-65 ${x} ${y})`}
                          textAnchor="end"
                          fontSize={isPdf ? '7px' : '8px'}
                          fill={isPdf ? '#374151' : '#d1d5db'}
                      >
                          {dateLabel}
                      </text>
                    }
                    <line x1={x} y1={height - margin.bottom} x2={x} y2={height - margin.bottom + (isPdf ? 2: 4)} stroke={isPdf ? '#374151' : '#d1d5db'} strokeWidth="0.5" />
                </g>
            );
        })}
        <text x={width / 2} y={height - 5} textAnchor="middle" fontSize="10px" fill={isPdf ? '#333' : '#9ca3af'}>Date</text>

        {linePath && <path d={linePath} fill="none" stroke="#818cf8" strokeWidth="1.5" />}

        {data.map((point, i) => {
          const violationRule = violationMap.get(i);
          const isRejectionViolation = !!violationRule;
          const isWarningViolation = !isRejectionViolation && westgardViolations.some(v => v.rule.includes('Warning') && v.dataPointIndices?.includes(i));

          let pointColor = point.isCurrentMonth ? '#a78bfa' : '#6366f1';
          let pointRadius = point.isCurrentMonth ? "4.5" : "4";
          let pointStroke = isPdf ? 'black' : 'white';
          let pointStrokeWidth = isPdf ? '0.5' : (point.isCurrentMonth ? '1.5' : '1');
          let titleMessage = `${point.date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', calendar: 'persian' })}: ${point.value.toFixed(2)}`;

          if (isRejectionViolation) {
            pointColor = '#ef4444';
            pointRadius = "5.5";
            pointStrokeWidth = isPdf ? '0.5' : '1.5';
            titleMessage += ` - VIOLATION: ${violationRule}`;
          } else if (isWarningViolation) {
            pointColor = '#f97316';
            pointRadius = "5";
            titleMessage += ' - WARNING: 1_2s';
          } else if (observedMean !== null && observedSD !== null && observedSD > 0) {
            const z = calculateZScore(point.value, observedMean, observedSD);
            if (z !== null && Math.abs(z) > 1) {
              pointColor = point.isCurrentMonth ? '#facc15' : '#eab308';
            }
          }

          return (
            <g key={`point-group-${i}`}>
              <circle key={`point-${i}`} cx={xScale(i)} cy={yScale(point.value)} r={pointRadius} fill={pointColor} stroke={pointStroke} strokeWidth={pointStrokeWidth}>
                <title>{titleMessage}</title>
              </circle>
              {isRejectionViolation && (
                <text x={xScale(i)} y={yScale(point.value) - 10} textAnchor="middle" fontSize="10px" fill={isPdf ? '#b91c1c' : '#fca5a5'} fontWeight="bold" className="pointer-events-none">
                  {violationRule}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
