import React, {useState} from "react";
import {FiBookOpen, FiPlus} from "react-icons/fi";
import {RiLiveFill} from "react-icons/ri";
import {CiShare2} from "react-icons/ci";
import {Link} from "react-router-dom";

// ─── Individual action card ───────────────────────────────────────────────────
const Card = ({
  title,
  subtitle,
  Icon,
  path,
  accent = "#6366f1",
  accentBg = "rgba(99,102,241,0.12)",
  badge,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={path}
      style={{textDecoration: "none", color: "inherit", display: "block"}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          padding: "20px 18px",
          borderRadius: 12,
          background: hovered
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.03)",
          border: `0.5px solid ${hovered ? `${accent}55` : "rgba(255,255,255,0.08)"}`,
          transition: "all 0.2s ease",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          cursor: "pointer",
          overflow: "hidden",
          height: "100%",
          minHeight: 110,
        }}
      >
        {/* Ambient glow on hover */}
        <div
          style={{
            position: "absolute",
            bottom: -30,
            right: -30,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s",
            pointerEvents: "none",
          }}
        />

        {/* Large bg icon */}
        <Icon
          style={{
            position: "absolute",
            top: -10,
            right: -8,
            fontSize: 72,
            color: hovered ? `${accent}30` : "rgba(255,255,255,0.04)",
            transition: "all 0.25s ease",
            transform: hovered
              ? "rotate(10deg) scale(1.05)"
              : "rotate(0deg) scale(1)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        {badge && (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontSize: 10,
              fontWeight: 500,
              background: "rgba(251,191,36,0.12)",
              color: "#fbbf24",
              border: "0.5px solid rgba(251,191,36,0.3)",
              padding: "2px 7px",
              borderRadius: 20,
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
          >
            {badge}
          </span>
        )}

        {/* Icon pill */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: hovered ? accentBg : "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            transition: "all 0.2s",
            border: `0.5px solid ${hovered ? `${accent}40` : "rgba(255,255,255,0.06)"}`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Icon
            style={{
              fontSize: 16,
              color: hovered ? accent : "#64748b",
              transition: "color 0.2s",
            }}
          />
        </div>

        {/* Text */}
        <div style={{position: "relative", zIndex: 1}}>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: hovered ? "#e2e8f0" : "#94a3b8",
              marginBottom: 3,
              lineHeight: 1.3,
              transition: "color 0.2s",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: 11,
              color: hovered ? "#64748b" : "#334155",
              lineHeight: 1.5,
              transition: "color 0.2s",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
};

// ─── Grid ─────────────────────────────────────────────────────────────────────
const HoverDevCards = () => {
  return (
    <div style={{padding: "4px 2px"}}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 8,
        }}
      >
        <Card
          title="Create timetable"
          subtitle="Generate a new schedule"
          path="create-table"
          Icon={FiPlus}
          accent="#6366f1"
          accentBg="rgba(99,102,241,0.15)"
        />
        <Card
          title="User manual"
          subtitle="Guides and documentation"
          path="manual"
          Icon={FiBookOpen}
          accent="#8b5cf6"
          accentBg="rgba(139,92,246,0.15)"
        />
        <Card
          title="Schedule demo"
          subtitle="Live guidance session"
          path="demo"
          Icon={RiLiveFill}
          accent="#f59e0b"
          accentBg="rgba(245,158,11,0.12)"
          badge="Live"
        />
        <Card
          title="Invite others"
          subtitle="Share with your team"
          path="invite"
          Icon={CiShare2}
          accent="#10b981"
          accentBg="rgba(16,185,129,0.12)"
        />
      </div>
    </div>
  );
};

export default HoverDevCards;
