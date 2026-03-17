import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarGrid = ({ 
  appointments, 
  onSlotClick, 
  selectedDate, 
  selectedTime,
  currentWeekStart,
  onPrevWeek,
  onNextWeek
}) => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const startHour = 8;
  const endHour = 19;
  const slotDuration = 15;

  const weekDates = days.map((_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const getTimePosition = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return ((h - startHour) * 60 + m) / slotDuration;
  };

  const formatWeekRange = () => {
    const end = new Date(currentWeekStart);
    end.setDate(currentWeekStart.getDate() + 4);
    const options = { day: 'numeric', month: 'short' };
    return `${currentWeekStart.toLocaleDateString('es-ES', options)} - ${end.toLocaleDateString('es-ES', options)} ${end.getFullYear()}`;
  };

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
      {/* Selector de Semanas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={onPrevWeek} className="btn" style={{ padding: '0.5rem', background: 'white', border: '1px solid #e2e8f0' }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{formatWeekRange()}</div>
        <button onClick={onNextWeek} className="btn" style={{ padding: '0.5rem', background: 'white', border: '1px solid #e2e8f0' }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Header Días */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ padding: '0.5rem' }}></div>
        {days.map((day, i) => (
          <div key={day} style={{ padding: '0.5rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{day}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{weekDates[i].split('-').reverse().slice(0, 2).join('/')}</div>
          </div>
        ))}
      </div>

      {/* Grid del Cuerpo */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', height: '500px', overflowY: 'auto', position: 'relative' }}>
        {/* Eje de Horas */}
        <div style={{ gridColumn: '1' }}>
          {Array.from({ length: endHour - startHour + 1 }).map((_, i) => (
            <div key={i} style={{ height: '60px', padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderBottom: '1px dashed #e2e8f0', textAlign: 'right' }}>
              {String(startHour + i).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Columnas de Días */}
        {weekDates.map((date, dayIdx) => (
          <div key={date} style={{ position: 'relative', borderLeft: '1px solid #e2e8f0', background: 'white' }}>
            {/* Citas como bloques */}
            {appointments
              .filter(app => app.date === date && app.status !== 'cancelled')
              .map(app => {
                const startPos = getTimePosition(app.time);
                const height = (app.duration_minutes / slotDuration) * 15;
                const isConfirmed = app.status === 'confirmed';
                
                return (
                  <div key={app.id} style={{
                    position: 'absolute',
                    top: `${startPos * 15}px`,
                    left: '2px',
                    right: '2px',
                    height: `${height - 1}px`,
                    background: isConfirmed ? '#dcfce7' : '#dbeafe',
                    borderLeft: `4px solid ${isConfirmed ? '#22c55e' : '#3b82f6'}`,
                    borderRadius: '4px',
                    padding: '6px',
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    zIndex: 10,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontWeight: '800', color: isConfirmed ? '#166534' : '#1e40af', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {app.treatment}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: isConfirmed ? '#15803d' : '#2563eb', fontWeight: '600' }}>
                      {app.time} ({app.duration_minutes}m)
                    </div>
                  </div>
                );
              })}

            {/* Grid Interactivo */}
            {Array.from({ length: (endHour - startHour) * (60 / slotDuration) }).map((_, slotIdx) => {
              const h = startHour + Math.floor(slotIdx / 4);
              const m = (slotIdx % 4) * slotDuration;
              const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
              
              const isSelected = selectedDate === date && selectedTime === time;

              return (
                <div 
                  key={slotIdx}
                  onClick={() => onSlotClick(date, time)}
                  style={{
                    height: '15px',
                    borderBottom: slotIdx % 4 === 3 ? '1px solid #f1f5f9' : 'none',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  }}
                  onMouseOver={(e) => !isSelected && (e.target.style.background = '#f8fafc')}
                  onMouseOut={(e) => !isSelected && (e.target.style.background = 'transparent')}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
