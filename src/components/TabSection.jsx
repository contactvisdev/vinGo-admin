import React from 'react';
import { Nav, Button } from 'react-bootstrap';

const TabSection = ({
  activeTab,
  handleTabChange,
  loading = false,
  addButtonText,
  onAddClick,
  additionalButtons,
  tabOptions,
  tabs,
  onTabChange
}) => {
  const isTopTabSwitcherMode = tabs && onTabChange;

  const defaultTabOptions = [
    { key: 'pending', label: 'Pending Listing' },
    { key: 'approved', label: 'Approved Listing' }
  ];

  const currentTabOptions = isTopTabSwitcherMode ? tabs : tabOptions || defaultTabOptions;
  return (
    <div className="d-flex justify-content-between mb-2">
      <div className="">
        <Nav variant="tabs">
          {currentTabOptions.map((tab) => (
            <Nav.Item key={tab.key || tab.value}>
              <Nav.Link
                active={isTopTabSwitcherMode ? activeTab === tab.value : activeTab === tab.key}
                onClick={() => !loading && (isTopTabSwitcherMode ? onTabChange(tab.value) : handleTabChange(tab.key))}
                className={`${isTopTabSwitcherMode ? (activeTab === tab.value ? 'text-primary fw-semibold' : 'text-secondary') : activeTab === tab.key ? 'text-primary fw-semibold' : 'text-secondary'} ${loading ? 'disabled' : ''}`}
                style={loading ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
              >
                {tab.label || tab.name}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* Action Buttons */}
      <div className="">
        {addButtonText && (
          <Button variant="primary" onClick={onAddClick} disabled={loading} className={additionalButtons ? '' : ''}>
            {addButtonText}
          </Button>
        )}

        {additionalButtons && <div className="d-inline-block ms-2">{additionalButtons}</div>}
      </div>
    </div>
  );
};

export default TabSection;
