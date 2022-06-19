import React, { useContext, useEffect, useState } from "react";
import "../../Styles/ToggleTheme.css";
export default function ToggleTheme(props) {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );
  useEffect(() => {
    document.getElementsByTagName("HTML")[0].setAttribute("data-theme", "dark");
  }, []);
  const toggleThemeChange = () => {
    if (isDark) {
      localStorage.setItem("theme", "light");
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "light");
      setIsDark(false);
    } else {
      localStorage.setItem("theme", "dark");
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <div>
      {/* <label class="switch">
        <input
          type="checkbox"
          defaultChecked={isDark}
          onChange={toggleThemeChange}
        />
        <span class="slider round"></span>
      </label> */}
    </div>
  );
}
