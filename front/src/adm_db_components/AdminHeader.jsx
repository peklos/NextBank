import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutEmployee } from "../features/employee/employeeSlice";
import { clearAdmin } from "../features/admin/adminSlice";
import styles from "../styles/adminHeader.module.css";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employee = useSelector((state) => state.employee);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("employee_token");
    dispatch(logoutEmployee());
    dispatch(clearAdmin());
    navigate("/admin/login");
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/admin/profile");
  };

  const handleDashboardClick = () => {
    setShowDropdown(false);
    navigate("/admin/dashboard");
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <div className={styles.logo} onClick={handleDashboardClick} style={{ cursor: 'pointer' }}>
            <div className={styles.logoIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L3 7V21H21V7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 16V12M8 12H16"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.bankName}>NEXT</span>
              <span className={styles.adminLabel}>Admin Panel</span>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.userInfoWrapper} ref={dropdownRef}>
            <div
              className={styles.userInfo}
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.userAvatar}>
                {employee.first_name?.charAt(0)}
                {employee.last_name?.charAt(0)}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>
                  {employee.first_name} {employee.last_name}
                </span>
                <span className={styles.userRole}>{employee.role?.name}</span>
              </div>
              <svg
                className={`${styles.dropdownIcon} ${showDropdown ? styles.dropdownIconOpen : ''}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {showDropdown && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>
                    {employee.first_name?.charAt(0)}
                    {employee.last_name?.charAt(0)}
                  </div>
                  <div className={styles.dropdownInfo}>
                    <span className={styles.dropdownName}>
                      {employee.first_name} {employee.last_name}
                    </span>
                    <span className={styles.dropdownEmail}>{employee.email}</span>
                  </div>
                </div>

                <div className={styles.dropdownDivider} />

                <button className={styles.dropdownItem} onClick={handleDashboardClick}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>Панель управления</span>
                </button>

                <button className={styles.dropdownItem} onClick={handleProfileClick}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>Мой профиль</span>
                </button>

                <div className={styles.dropdownDivider} />

                <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>Выйти</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;