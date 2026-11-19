import os
import time
from selenium import webdriver
from selenium.webdriver.edge.options import Options

# HTML template for 1200x630 LinkedIn Showcase Card
html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>LinkedIn Portfolio Preview</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 1200px;
            height: 630px;
            overflow: hidden;
            background: #070a12;
            font-family: 'Inter', -apple-system, sans-serif;
            color: #f8fafc;
            display: flex;
            position: relative;
        }

        /* High-tech gradient background glows */
        .glow-bg-1 {
            position: absolute;
            top: -120px;
            left: -100px;
            width: 550px;
            height: 550px;
            background: radial-gradient(circle, rgba(0, 242, 254, 0.18) 0%, rgba(79, 172, 254, 0.05) 50%, transparent 70%);
            filter: blur(60px);
            z-index: 1;
        }
        .glow-bg-2 {
            position: absolute;
            bottom: -150px;
            right: -100px;
            width: 650px;
            height: 650px;
            background: radial-gradient(circle, rgba(127, 0, 255, 0.16) 0%, rgba(225, 0, 255, 0.04) 50%, transparent 70%);
            filter: blur(70px);
            z-index: 1;
        }
        .grid-overlay {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 40px 40px;
            z-index: 2;
        }

        /* Main Container Card */
        .card-container {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
            padding: 48px 56px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Top Bar */
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #ffffff;
        }
        .logo-accent {
            color: #00f2fe;
        }
        .site-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            background: rgba(0, 242, 254, 0.08);
            border: 1px solid rgba(0, 242, 254, 0.3);
            border-radius: 50px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            font-weight: 500;
            color: #00f2fe;
            box-shadow: 0 0 20px rgba(0, 242, 254, 0.15);
        }
        .pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #00f2fe;
            box-shadow: 0 0 10px #00f2fe;
        }

        /* Content Area */
        .main-content {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 40px;
            align-items: center;
        }

        /* Left Column */
        .role-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #38bdf8;
            margin-bottom: 14px;
        }
        .name {
            font-family: 'Outfit', sans-serif;
            font-size: 54px;
            font-weight: 800;
            line-height: 1.05;
            letter-spacing: -1px;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #38bdf8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .tagline {
            font-size: 18px;
            color: #94a3b8;
            line-height: 1.45;
            margin-bottom: 22px;
        }
        .institution {
            color: #e2e8f0;
            font-weight: 600;
        }

        /* Credentials Badges */
        .credentials-row {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 22px;
        }
        .cred-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            background: rgba(248, 152, 32, 0.1);
            border: 1px solid rgba(248, 152, 32, 0.35);
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #fbbf24;
        }
        .cred-badge.academic {
            background: rgba(56, 189, 248, 0.1);
            border-color: rgba(56, 189, 248, 0.35);
            color: #38bdf8;
        }

        /* Tech Pills */
        .tech-row {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .tech-pill {
            padding: 5px 12px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            color: #cbd5e1;
        }

        /* Right Column - Project Showcase Cards */
        .project-cards {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .proj-card {
            padding: 16px 20px;
            background: rgba(18, 24, 41, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            backdrop-filter: blur(16px);
            display: flex;
            align-items: center;
            gap: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }
        .proj-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
        }
        .proj-card.p1::before { background: #38ef7d; }
        .proj-card.p2::before { background: #00f2fe; }
        .proj-card.p3::before { background: #e100ff; }

        .proj-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }
        .proj-card.p1 .proj-icon {
            background: rgba(56, 239, 125, 0.12);
            color: #38ef7d;
            border: 1px solid rgba(56, 239, 125, 0.25);
        }
        .proj-card.p2 .proj-icon {
            background: rgba(0, 242, 254, 0.12);
            color: #00f2fe;
            border: 1px solid rgba(0, 242, 254, 0.25);
        }
        .proj-card.p3 .proj-icon {
            background: rgba(225, 0, 255, 0.12);
            color: #e100ff;
            border: 1px solid rgba(225, 0, 255, 0.25);
        }

        .proj-details h4 {
            font-family: 'Outfit', sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 2px;
        }
        .proj-details p {
            font-size: 13px;
            color: #94a3b8;
        }
        .proj-badge {
            margin-left: auto;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 50px;
            background: rgba(255, 255, 255, 0.05);
            color: #cbd5e1;
            white-space: nowrap;
        }

        /* Bottom Bar */
        .bottom-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 18px;
            border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .links-group {
            display: flex;
            gap: 24px;
            font-size: 14px;
            color: #94a3b8;
        }
        .links-group span {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .links-group strong {
            color: #e2e8f0;
        }
        .cta-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 22px;
            background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
            color: #04101e;
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            font-weight: 700;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 242, 254, 0.35);
        }
    </style>
</head>
<body>
    <div class="glow-bg-1"></div>
    <div class="glow-bg-2"></div>
    <div class="grid-overlay"></div>

    <div class="card-container">
        <!-- Top Navigation -->
        <div class="top-bar">
            <div class="logo">
                <span class="logo-accent">&lt;</span>Bharath<span class="logo-accent">.ai /&gt;</span>
            </div>
            <div class="site-pill">
                <span class="pulse-dot"></span>
                <span>bharathnow.github.io</span>
            </div>
        </div>

        <!-- Main Middle Showcase -->
        <div class="main-content">
            <!-- Left Info -->
            <div class="hero-left">
                <div class="role-badge">
                    <span>⚡ Software Engineer &amp; AI Developer</span>
                </div>
                <h1 class="name">Mothukuri Bharath</h1>
                <p class="tagline">
                    <span class="institution">Saveetha School of Engineering</span> • B.E. CSE (Artificial Intelligence)<br>
                    Crafting machine learning models, regression analytics &amp; native Android software.
                </p>
                <div class="credentials-row">
                    <div class="cred-badge academic">
                        <span>🎓 CGPA: 8.59 / 10.0</span>
                    </div>
                    <div class="cred-badge">
                        <span>☕ Oracle Certified Java SE 17</span>
                    </div>
                    <div class="cred-badge">
                        <span>🗄️ Oracle Certified MySQL</span>
                    </div>
                </div>
                <div class="tech-row">
                    <span class="tech-pill">Python</span>
                    <span class="tech-pill">Java</span>
                    <span class="tech-pill">C++</span>
                    <span class="tech-pill">SQL</span>
                    <span class="tech-pill">Scikit-Learn</span>
                    <span class="tech-pill">Pandas</span>
                    <span class="tech-pill">Android Studio</span>
                    <span class="tech-pill">React.js</span>
                </div>
            </div>

            <!-- Right Projects Stack -->
            <div class="project-cards">
                <!-- Project 1: Detox -->
                <div class="proj-card p1">
                    <div class="proj-icon">📱</div>
                    <div class="proj-details">
                        <h4>Detox Screen Time App</h4>
                        <p>Native Android • Java &amp; Android SDK</p>
                    </div>
                    <div class="proj-badge">Shipped App</div>
                </div>

                <!-- Project 2: Stock Predictor -->
                <div class="proj-card p2">
                    <div class="proj-icon">📈</div>
                    <div class="proj-details">
                        <h4>Stock Price Prediction</h4>
                        <p>AI Regression • TCS &amp; Amazon</p>
                    </div>
                    <div class="proj-badge">80%–85% Accuracy</div>
                </div>

                <!-- Project 3: Car Regressor -->
                <div class="proj-card p3">
                    <div class="proj-icon">🚗</div>
                    <div class="proj-details">
                        <h4>Car Market Price Predictor</h4>
                        <p>5,000+ Vehicles • Feature Selection</p>
                    </div>
                    <div class="proj-badge">+20% Boost</div>
                </div>
            </div>
        </div>

        <!-- Bottom Footer -->
        <div class="bottom-bar">
            <div class="links-group">
                <span>GitHub: <strong>bharathnow</strong></span>
                <span>LinkedIn: <strong>mothukuribharath25</strong></span>
                <span>Internship: <strong>HDLC Data Science &amp; ML</strong></span>
            </div>
            <div class="cta-button">
                <span>View Portfolio &amp; Resume →</span>
            </div>
        </div>
    </div>
</body>
</html>
"""

# Write HTML card file
card_path = os.path.abspath("preview_card.html")
with open(card_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Created {card_path}")

# Render with Selenium Edge Headless
options = Options()
options.add_argument("--headless")
options.add_argument("--window-size=1200,630")
options.add_argument("--hide-scrollbars")
options.add_argument("--force-device-scale-factor=1")

driver = webdriver.Edge(options=options)
driver.get(f"file:///{card_path.replace(os.sep, '/')}")
time.sleep(1.5)  # Wait for Google fonts to render

# Ensure assets dir exists
os.makedirs("assets", exist_ok=True)

# Screenshot exact body element
from selenium.webdriver.common.by import By
from PIL import Image

body = driver.find_element(By.TAG_NAME, "body")
body.screenshot("preview.png")
driver.quit()

im = Image.open("preview.png")
if im.size != (1200, 630):
    im = im.resize((1200, 630), Image.Resampling.LANCZOS)
im.save("preview.png")
im.save("assets/preview.png")
im.save("assets/linkedin-preview.png")

print("Successfully generated preview.png, assets/preview.png, and assets/linkedin-preview.png at 1200x630!")
