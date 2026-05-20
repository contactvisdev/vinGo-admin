import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopTitleCard({ title, breadcrumbs }) {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.url) {
      navigate(item.url);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-3">
      <div className="card-body d-flex justify-content-between align-items-center py-3 px-4">
        <div>
          <h4 className="mb-1 fw-semibold">{title}</h4>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small">
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <li
                      key={item.label || index}
                      className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                      aria-current={isLast ? 'page' : undefined}
                      onClick={() => !isLast && item.url && handleClick(item)} // <--- FIX
                      style={{ cursor: !isLast && item.url ? 'pointer' : 'default' }}
                    >
                      {item.label}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export function TopTabSwitcher({ tabs = [], defaultTab, onTabChange }) {
  const [activeTab, setActiveTab] = useState(null);
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  useEffect(() => {
    if (!defaultTab && tabs.length > 0 && activeTab === null) {
      setActiveTab(tabs[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);
  const handleTabClick = (tab) => {
    setActiveTab(tab.value);
    onTabChange && onTabChange(tab.value);
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-3">
      <div className="card-body px-4 pb-0">
        <ul className="nav nav-tabs d-flex gap-3 border-0 gap-8">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.value}>
              <button
                className={
                  `nav-link px-4 py-2 rounded-top fw-semibold ` +
                  `${activeTab === tab.value ? 'active bg-white border border-bottom-0' : 'bg-light border'}`
                }
                onClick={() => handleTabClick(tab)}
                style={{ cursor: 'pointer' }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
