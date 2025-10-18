import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutEmployee } from "../features/employee/employeeSlice";
import { clearAdmin } from "../features/admin/adminSlice";
import styles from "../styles/adminHeader.module.css";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employee = useSelector((state) => state.employee);

  const handleLogout = () => {
    // Очищаем токен
    localStorage.removeItem("employee_token");

    // Очищаем Redux state
    dispatch(logoutEmployee());
    dispatch(clearAdmin());

    // Перенаправляем на страницу входа
    navigate("/admin/login");
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
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
          <div className={styles.userInfo}>
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
          </div>

          <button className={styles.logoutButton} onClick={handleLogout}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
