import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  background: rgba(10, 14, 39, 0.95);
  border: 1px solid var(--intel-cyan, #00D9FF);
  border-radius: 0;
  position: relative;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
  
  /* Tactical corners */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border: 2px solid var(--intel-cyan, #00D9FF);
    border-right: none;
    border-bottom: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border: 2px solid var(--intel-cyan, #00D9FF);
    border-left: none;
    border-bottom: none;
  }
`;

const IntelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 217, 255, 0.3);
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
`;

const IntelTitle = styled.h3`
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--intel-cyan, #00D9FF);
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
`;

const ClassificationLevel = styled.span`
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--alert-red, #FF0033);
  text-transform: uppercase;
  font-weight: 700;
`;

const PanelContent = styled.div`
  position: relative;
  z-index: 1;
  color: #00D9FF;
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  letter-spacing: 0.5px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 217, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: rgba(0, 217, 255, 0.7);
  font-weight: 500;
`;

const StatValue = styled.span`
  color: var(--intel-cyan, #00D9FF);
  font-weight: 700;
  text-shadow: 0 0 5px var(--intel-cyan, #00D9FF);
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: ${props => {
    switch(props.status) {
      case 'success':
        return 'rgba(0, 255, 65, 0.2)';
      case 'alert':
        return 'rgba(255, 0, 51, 0.2)';
      case 'pending':
        return 'rgba(255, 215, 0, 0.2)';
      default:
        return 'rgba(0, 217, 255, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'success':
        return '#00FF41';
      case 'alert':
        return '#FF0033';
      case 'pending':
        return '#FFD700';
      default:
        return '#00D9FF';
    }
  }};
  border: 1px solid currentColor;
`;

const BottomCorners = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border: 2px solid var(--intel-cyan, #00D9FF);
    border-right: none;
    border-top: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border: 2px solid var(--intel-cyan, #00D9FF);
    border-left: none;
    border-top: none;
  }
`;

const IntelPanel = ({
  title = 'INTEL REPORT',
  classification = 'TOP SECRET',
  status = 'active',
  children,
  stats = [],
  compact = false
}) => {
  return (
    <PanelContainer>
      <IntelHeader>
        <div>
          <ClassificationLevel>{classification}</ClassificationLevel>
          <IntelTitle>{title}</IntelTitle>
        </div>
        <StatusBadge status={status}>
          {status}
        </StatusBadge>
      </IntelHeader>

      <PanelContent>
        {stats && stats.length > 0 ? (
          <div>
            {stats.map((stat, idx) => (
              <StatRow key={idx}>
                <StatLabel>{stat.label}</StatLabel>
                <StatValue>{stat.value}</StatValue>
              </StatRow>
            ))}
          </div>
        ) : null}
        {children}
      </PanelContent>

      <BottomCorners />
    </PanelContainer>
  );
};

export default IntelPanel;
