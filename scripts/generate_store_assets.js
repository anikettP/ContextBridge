import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PORT = 3333;

const HTML_CONTENT = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ContextBridge Store Asset Generator (Light Theme)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; padding: 20px; }
    h2 { color: #2563eb; }
    canvas { border: 1px solid #cbd5e1; margin-bottom: 20px; display: block; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .status { padding: 12px; background: #2563eb; color: #fff; border-radius: 8px; font-weight: bold; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h2>ContextBridge Light Theme Store Asset Generator</h2>
  <div id="status" class="status">Initializing canvases...</div>

  <h3>Store Icon (128x128, 48x48, 32x32, 16x16)</h3>
  <canvas id="canvas_icon128" width="128" height="128"></canvas>
  <canvas id="canvas_icon48" width="48" height="48"></canvas>
  <canvas id="canvas_icon32" width="32" height="32"></canvas>
  <canvas id="canvas_icon16" width="16" height="16"></canvas>

  <h3>Small Promo Tile (440x280)</h3>
  <canvas id="canvas_promo_small" width="440" height="280"></canvas>

  <h3>Marquee Promo Tile (1400x560)</h3>
  <canvas id="canvas_promo_marquee" width="1400" height="560"></canvas>

  <h3>Screenshot 1: 1-Click Context Transfer (1280x800)</h3>
  <canvas id="canvas_ss1" width="1280" height="800"></canvas>

  <h3>Screenshot 2: Privacy Shield (1280x800)</h3>
  <canvas id="canvas_ss2" width="1280" height="800"></canvas>

  <h3>Screenshot 3: Target Personas (1280x800)</h3>
  <canvas id="canvas_ss3" width="1280" height="800"></canvas>

  <h3>Screenshot 4: Token Optimization (1280x800)</h3>
  <canvas id="canvas_ss4" width="1280" height="800"></canvas>

  <h3>Screenshot 5: Multi-AI Support (1280x800)</h3>
  <canvas id="canvas_ss5" width="1280" height="800"></canvas>

  <script>
    // Helper to draw rounded rect
    CanvasRenderingContext2D.prototype.roundRectCustom = function(x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };

    // Helper for drawing clean Bridge Icon
    function drawBridgeIcon(ctx, cx, cy, size, scale = 1, lightBg = true) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Radial background glow
      const bgGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, size * 0.65);
      bgGlow.addColorStop(0, lightBg ? 'rgba(37, 99, 235, 0.15)' : 'rgba(0, 242, 254, 0.35)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Main Outer Arch
      const archGrad1 = ctx.createLinearGradient(-size * 0.4, 0, size * 0.4, 0);
      archGrad1.addColorStop(0, '#2563eb');
      archGrad1.addColorStop(0.5, '#059669');
      archGrad1.addColorStop(1, '#7c3aed');

      ctx.lineWidth = Math.max(2, size * 0.075);
      ctx.lineCap = 'round';
      ctx.strokeStyle = archGrad1;
      ctx.shadowColor = lightBg ? 'rgba(37, 99, 235, 0.3)' : '#00f2fe';
      ctx.shadowBlur = Math.max(2, size * 0.08);

      ctx.beginPath();
      ctx.moveTo(-size * 0.42, size * 0.22);
      ctx.quadraticCurveTo(0, -size * 0.45, size * 0.42, size * 0.22);
      ctx.stroke();

      // Secondary Inner Arch
      const archGrad2 = ctx.createLinearGradient(-size * 0.4, 0, size * 0.4, 0);
      archGrad2.addColorStop(0, '#7c3aed');
      archGrad2.addColorStop(0.5, '#2563eb');
      archGrad2.addColorStop(1, '#059669');

      ctx.strokeStyle = archGrad2;
      ctx.shadowColor = lightBg ? 'rgba(124, 58, 237, 0.3)' : '#9d4edd';

      ctx.beginPath();
      ctx.moveTo(-size * 0.42, size * 0.22);
      ctx.quadraticCurveTo(0, -size * 0.25, size * 0.42, size * 0.22);
      ctx.stroke();

      // Vertical Support Pillars / Cable Strands
      ctx.shadowBlur = 0;
      ctx.lineWidth = Math.max(1, size * 0.035);
      const pillars = [-0.28, -0.14, 0, 0.14, 0.28];
      pillars.forEach((pxRatio, idx) => {
        const px = size * pxRatio;
        const pyTop = size * 0.22 - (1 - Math.pow(pxRatio / 0.42, 2)) * (size * 0.67);
        const pyBot = size * 0.22;

        ctx.strokeStyle = (idx % 2 === 0) ? 'rgba(37, 99, 235, 0.6)' : 'rgba(5, 150, 105, 0.6)';
        ctx.beginPath();
        ctx.moveTo(px, pyTop);
        ctx.lineTo(px, pyBot);
        ctx.stroke();
      });

      // Base Connection Line
      ctx.lineWidth = Math.max(2, size * 0.05);
      ctx.strokeStyle = lightBg ? '#0f172a' : '#ffffff';
      ctx.shadowColor = lightBg ? 'rgba(15, 23, 42, 0.2)' : '#ffffff';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(-size * 0.45, size * 0.22);
      ctx.lineTo(size * 0.45, size * 0.22);
      ctx.stroke();

      // Glowing AI Model Nodes on Bridge Base
      const nodes = [
        { x: -size * 0.45, y: size * 0.22, color: '#10a37f' }, // ChatGPT
        { x: -size * 0.225, y: size * 0.22, color: '#d97706' }, // Claude
        { x: 0, y: size * 0.22, color: '#2563eb' }, // Gemini
        { x: size * 0.225, y: size * 0.22, color: '#0284c7' }, // Copilot
        { x: size * 0.45, y: size * 0.22, color: '#7c3aed' }  // DeepSeek
      ];

      nodes.forEach(n => {
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(2.5, size * 0.055), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, size * 0.025), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    // 1. GENERATE STORE ICON (128x128, 48x48, 32x32, 16x16)
    function generateStoreIcons() {
      [128, 48, 32, 16].forEach(dim => {
        const canvas = document.getElementById('canvas_icon' + dim);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, dim, dim);

        // Vibrant Gradient background squircle
        const bgGrad = ctx.createLinearGradient(0, 0, dim, dim);
        bgGrad.addColorStop(0, '#2563eb');
        bgGrad.addColorStop(1, '#059669');

        ctx.fillStyle = bgGrad;
        const radius = dim * 0.22;
        ctx.roundRectCustom(0, 0, dim, dim, radius);
        ctx.fill();

        // White Bridge Graphic inside Icon
        ctx.save();
        ctx.translate(dim / 2, dim / 2 - dim * 0.02);
        const scale = dim / 128;
        const size = dim * 0.72;

        // White arch 1
        ctx.lineWidth = Math.max(2, size * 0.08);
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = Math.max(1, dim * 0.05);

        ctx.beginPath();
        ctx.moveTo(-size * 0.42, size * 0.22);
        ctx.quadraticCurveTo(0, -size * 0.45, size * 0.42, size * 0.22);
        ctx.stroke();

        // White arch 2
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.moveTo(-size * 0.42, size * 0.22);
        ctx.quadraticCurveTo(0, -size * 0.25, size * 0.42, size * 0.22);
        ctx.stroke();

        // Base Line
        ctx.lineWidth = Math.max(2, size * 0.06);
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-size * 0.45, size * 0.22);
        ctx.lineTo(size * 0.45, size * 0.22);
        ctx.stroke();

        // 5 Bright Nodes
        const nodes = [-0.45, -0.225, 0, 0.225, 0.45];
        nodes.forEach(nx => {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(size * nx, size * 0.22, Math.max(2, size * 0.055), 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      });
    }

    // 2. GENERATE SMALL PROMO TILE (440x280 - LIGHT THEME)
    function generateSmallPromo() {
      const canvas = document.getElementById('canvas_promo_small');
      const ctx = canvas.getContext('2d');
      const w = 440, h = 280;

      // Clean Light background
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#ffffff');
      bg.addColorStop(0.6, '#f8fafc');
      bg.addColorStop(1, '#eff6ff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle ambient light glows
      const orb1 = ctx.createRadialGradient(80, 60, 10, 80, 60, 180);
      orb1.addColorStop(0, 'rgba(37, 99, 235, 0.08)');
      orb1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, w, h);

      const orb2 = ctx.createRadialGradient(360, 220, 10, 360, 220, 160);
      orb2.addColorStop(0, 'rgba(5, 150, 105, 0.08)');
      orb2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, w, h);

      // Card Container Border
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1;
      ctx.roundRectCustom(12, 12, w - 24, h - 24, 16);
      ctx.stroke();

      // Central Bridge Graphic
      drawBridgeIcon(ctx, w / 2, 85, 110, 1, true);

      // Title Text
      ctx.textAlign = 'center';
      ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      
      const textGrad = ctx.createLinearGradient(120, 0, 320, 0);
      textGrad.addColorStop(0, '#0f172a');
      textGrad.addColorStop(0.5, '#2563eb');
      textGrad.addColorStop(1, '#059669');
      ctx.fillStyle = textGrad;
      ctx.fillText('ContextBridge', w / 2, 158);

      // Subtitle
      ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('UNIVERSAL AI CONTEXT & PROMPT SYNC', w / 2, 178);

      // Supported AI Badges Grid (2 rows of 3 badges)
      const providersRow1 = [
        { name: 'ChatGPT', color: '#10a37f' },
        { name: 'Claude', color: '#d97706' },
        { name: 'Gemini', color: '#2563eb' }
      ];

      const providersRow2 = [
        { name: 'Grok', color: '#475569' },
        { name: 'DeepSeek', color: '#7c3aed' },
        { name: 'Copilot', color: '#0284c7' }
      ];

      const startX = 40;
      const pillW = 108;
      const pillH = 22;
      const spacingX = 124;

      // Row 1
      providersRow1.forEach((p, i) => {
        const bx = startX + i * spacingX;
        const by = 192;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.roundRectCustom(bx, by, pillW, pillH, 11);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(bx + 14, by + 11, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.textAlign = 'left';
        ctx.font = '700 10.5px sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(p.name, bx + 24, by + 14.5);
      });

      // Row 2
      providersRow2.forEach((p, i) => {
        const bx = startX + i * spacingX;
        const by = 220;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.roundRectCustom(bx, by, pillW, pillH, 11);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(bx + 14, by + 11, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.textAlign = 'left';
        ctx.font = '700 10.5px sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(p.name, bx + 24, by + 14.5);
      });

      // Bottom Feature Badges
      ctx.textAlign = 'center';
      const botY = 258;
      
      // Left Feature
      ctx.fillStyle = 'rgba(5, 150, 105, 0.08)';
      ctx.strokeStyle = 'rgba(5, 150, 105, 0.3)';
      ctx.roundRectCustom(35, botY - 10, 175, 20, 10);
      ctx.fill(); ctx.stroke();
      ctx.font = '700 9.5px sans-serif';
      ctx.fillStyle = '#059669';
      ctx.fillText('🛡️ 100% Local Privacy', 122.5, botY + 3.5);

      // Right Feature
      ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.3)';
      ctx.roundRectCustom(230, botY - 10, 175, 20, 10);
      ctx.fill(); ctx.stroke();
      ctx.font = '700 9.5px sans-serif';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('⚡ 60-80% Token Savings', 317.5, botY + 3.5);
    }

    // 3. GENERATE MARQUEE PROMO TILE (1400x560 - LIGHT THEME)
    function generateMarqueePromo() {
      const canvas = document.getElementById('canvas_promo_marquee');
      const ctx = canvas.getContext('2d');
      const w = 1400, h = 560;

      // Clean Light background
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#f8fafc');
      bg.addColorStop(0.5, '#ffffff');
      bg.addColorStop(1, '#eff6ff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Ambient radial glow left
      const orb1 = ctx.createRadialGradient(250, 280, 50, 250, 280, 450);
      orb1.addColorStop(0, 'rgba(37, 99, 235, 0.07)');
      orb1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, w, h);

      // Ambient radial glow right
      const orb2 = ctx.createRadialGradient(1050, 280, 50, 1050, 280, 450);
      orb2.addColorStop(0, 'rgba(5, 150, 105, 0.07)');
      orb2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, w, h);

      // Outer Border line
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 2;
      ctx.roundRectCustom(20, 20, w - 40, h - 40, 24);
      ctx.stroke();

      // LEFT SIDE CONTENT (x: 80, y: 80)
      // Brand Pill
      ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.25)';
      ctx.lineWidth = 1;
      ctx.roundRectCustom(80, 80, 210, 32, 16);
      ctx.fill(); ctx.stroke();

      drawBridgeIcon(ctx, 100, 96, 22, 1, true);

      ctx.textAlign = 'left';
      ctx.font = '800 13px sans-serif';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('CHROME EXTENSION', 122, 101);

      // Main Headline
      ctx.font = '900 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const headGrad = ctx.createLinearGradient(80, 0, 600, 0);
      headGrad.addColorStop(0, '#0f172a');
      headGrad.addColorStop(0.6, '#2563eb');
      headGrad.addColorStop(1, '#059669');
      ctx.fillStyle = headGrad;
      ctx.fillText('ContextBridge', 80, 175);

      // Subheadline
      ctx.font = '700 24px sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.fillText('Universal AI Context & Architecture Sync', 80, 218);

      ctx.font = '500 16px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Transfer conversation goals, code schemas & decisions across', 80, 254);
      ctx.fillText('multiple web AI workspace environments seamlessly.', 80, 278);

      // Feature Highlight Cards (Left Side)
      const highlights = [
        { icon: '🛡️', title: '100% Local Privacy Shield', desc: 'Auto-redacts API keys & secrets before transfer' },
        { icon: '⚡', title: '60-80% Token Reduction', desc: 'Smart context compression engine' },
        { icon: '🎯', title: 'Tailored AI Role Directives', desc: 'Pre-formats prompts for Senior Architect & Tech Lead roles' }
      ];

      highlights.forEach((item, idx) => {
        const hy = 320 + idx * 62;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
        ctx.lineWidth = 1;
        ctx.roundRectCustom(80, hy, 560, 52, 12);
        ctx.fill(); ctx.stroke();

        ctx.font = '20px sans-serif';
        ctx.fillText(item.icon, 96, hy + 33);

        ctx.font = '700 14px sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(item.title, 132, hy + 24);

        ctx.font = '500 12px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(item.desc, 132, hy + 41);
      });

      // RIGHT SIDE UI MOCKUP CARD (x: 710, y: 70, w: 610, h: 420)
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.roundRectCustom(710, 70, 610, 420, 16);
      ctx.fill(); ctx.stroke();
      ctx.restore();

      // Extension Header Bar inside mockup
      ctx.fillStyle = '#f8fafc';
      ctx.roundRectCustom(710, 70, 610, 50, 16);
      ctx.fill();
      ctx.fillRect(710, 100, 610, 20);

      drawBridgeIcon(ctx, 735, 95, 28, 1, true);
      ctx.font = '800 16px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('ContextBridge UI', 760, 100);

      ctx.font = '700 11px sans-serif';
      ctx.fillStyle = '#059669';
      ctx.fillText('● ACTIVE ON CHATGPT', 1170, 100);

      // Body Content inside Mockup Card
      // Source Card
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeStyle = '#10a37f';
      ctx.lineWidth = 1;
      ctx.roundRectCustom(730, 135, 570, 65, 10);
      ctx.fill(); ctx.stroke();

      ctx.font = '700 11px sans-serif';
      ctx.fillStyle = '#10a37f';
      ctx.fillText('DETECTED SOURCE CONVERSATION', 745, 153);
      ctx.font = '500 11px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('18 Messages • 14,200 Tokens Captured', 1050, 153);

      ctx.font = '700 13px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('ChatGPT — Build Microservices & JWT Auth Architecture', 745, 178);

      // Target Selector
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.roundRectCustom(730, 212, 570, 75, 10);
      ctx.fill(); ctx.stroke();

      ctx.font = '700 11px sans-serif';
      ctx.fillStyle = '#d97706';
      ctx.fillText('TARGET AI DESTINATION', 745, 230);

      const targetButtons = [
        { name: 'Claude', active: true, color: '#d97706' },
        { name: 'Gemini', active: false, color: '#2563eb' },
        { name: 'Grok', active: false, color: '#475569' },
        { name: 'DeepSeek', active: false, color: '#7c3aed' },
        { name: 'Copilot', active: false, color: '#0284c7' }
      ];

      targetButtons.forEach((btn, i) => {
        const bx = 745 + i * 110;
        ctx.fillStyle = btn.active ? btn.color : '#ffffff';
        ctx.strokeStyle = btn.color;
        ctx.lineWidth = 1;
        ctx.roundRectCustom(bx, 242, 100, 32, 8);
        ctx.fill(); ctx.stroke();

        ctx.font = '700 12px sans-serif';
        ctx.fillStyle = btn.active ? '#ffffff' : '#0f172a';
        ctx.fillText(btn.active ? '✓ ' + btn.name : btn.name, bx + 16, 262);
      });

      // Strategy Stats Card
      ctx.fillStyle = '#f8fafc';
      ctx.roundRectCustom(730, 300, 570, 75, 10);
      ctx.fill();

      ctx.font = '700 11px sans-serif';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('STRATEGY: SMART CONTEXT COMPRESSION', 745, 322);

      ctx.font = '800 20px sans-serif';
      ctx.fillStyle = '#059669';
      ctx.fillText('2,850 Tokens', 745, 355);

      ctx.font = '700 12px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('(81.5% Token Savings • 96% Retention)', 915, 355);

      // Hero Transfer Button
      const btnGrad = ctx.createLinearGradient(730, 0, 1300, 0);
      btnGrad.addColorStop(0, '#2563eb');
      btnGrad.addColorStop(1, '#059669');

      ctx.fillStyle = btnGrad;
      ctx.roundRectCustom(730, 390, 570, 48, 12);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.font = '900 16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Transfer Conversation Context to Claude 🚀', 730 + 285, 420);
    }

    // Helper for Header Banner on Screenshots (LIGHT THEME)
    function drawScreenshotHeader(ctx, w, titleText, subtitleText) {
      // Header Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, 76);

      // Bottom border line
      const lg = ctx.createLinearGradient(0, 0, w, 0);
      lg.addColorStop(0, '#2563eb');
      lg.addColorStop(0.5, '#059669');
      lg.addColorStop(1, '#7c3aed');
      ctx.fillStyle = lg;
      ctx.fillRect(0, 74, w, 2);

      // Header Icon & Text
      drawBridgeIcon(ctx, 40, 37, 24, 1, true);

      ctx.textAlign = 'left';
      ctx.font = '900 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(titleText, 66, 44);

      ctx.textAlign = 'right';
      ctx.font = '700 13px sans-serif';
      ctx.fillStyle = '#2563eb';
      ctx.fillText(subtitleText, w - 40, 44);
    }

    // 4. GENERATE SCREENSHOT 1: 1-Click Context Transfer (1280x800 - LIGHT THEME)
    function generateScreenshot1() {
      const canvas = document.getElementById('canvas_ss1');
      const ctx = canvas.getContext('2d');
      const w = 1280, h = 800;

      // Clean Light Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      drawScreenshotHeader(ctx, w, 'ContextBridge — 1-Click Universal Context Transfer', 'SCREENSHOT 1 / 5');

      // Dual Window Layout
      // LEFT WINDOW: ChatGPT Window (x: 40, y: 100, w: 580, h: 660)
      ctx.fillStyle = '#ffffff';
      ctx.roundRectCustom(40, 100, 580, 660, 12); ctx.fill();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();

      // Window Header (ChatGPT)
      ctx.fillStyle = '#f1f5f9';
      ctx.roundRectCustom(40, 100, 580, 40, 12); ctx.fill();
      ctx.fillRect(40, 125, 580, 15);
      
      // Window Dots
      ctx.fillStyle = '#ff5f56'; ctx.beginPath(); ctx.arc(60, 120, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffbd2e'; ctx.beginPath(); ctx.arc(75, 120, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#27c93f'; ctx.beginPath(); ctx.arc(90, 120, 5, 0, Math.PI*2); ctx.fill();

      ctx.textAlign = 'left';
      ctx.font = '700 12px sans-serif';
      ctx.fillStyle = '#10a37f';
      ctx.fillText('ChatGPT (chatgpt.com)', 110, 124);

      // ChatGPT Chat Messages
      // User Msg
      ctx.fillStyle = '#f8fafc';
      ctx.roundRectCustom(60, 160, 540, 70, 10); ctx.fill();
      ctx.font = '700 12px sans-serif'; ctx.fillStyle = '#10a37f'; ctx.fillText('User:', 75, 180);
      ctx.font = '500 12px sans-serif'; ctx.fillStyle = '#0f172a';
      ctx.fillText('How do I build a scalable Node.js microservice architecture with JWT', 75, 200);
      ctx.fillText('authentication, React 19 frontend, and automated context syncing?', 75, 218);

      // Assistant Msg
      ctx.fillStyle = '#f1f5f9';
      ctx.roundRectCustom(60, 245, 540, 180, 10); ctx.fill();
      ctx.font = '700 12px sans-serif'; ctx.fillStyle = '#10a37f'; ctx.fillText('ChatGPT:', 75, 265);
      ctx.font = '500 12px sans-serif'; ctx.fillStyle = '#334155';
      ctx.fillText('Here is the recommended architecture pattern:', 75, 285);

      // Code Block inside ChatGPT
      ctx.fillStyle = '#0f172a';
      ctx.roundRectCustom(75, 300, 510, 110, 8); ctx.fill();
      ctx.font = '500 11px monospace'; ctx.fillStyle = '#34d399';
      ctx.fillText('// server.ts - JWT Auth Endpoint', 90, 322);
      ctx.fillStyle = '#93c5fd';
      ctx.fillText('import express from "express";', 90, 340);
      ctx.fillText('const app = express();', 90, 358);
      ctx.fillText('app.post("/api/auth", (req, res) => {', 90, 376);
      ctx.fillText('  const token = jwt.sign({ userId }, SECRET);', 90, 394);

      // RIGHT WINDOW: Claude Window (x: 660, y: 100, w: 580, h: 660)
      ctx.fillStyle = '#fafaf9';
      ctx.roundRectCustom(660, 100, 580, 660, 12); ctx.fill();
      ctx.strokeStyle = '#e7e5e4'; ctx.lineWidth = 1; ctx.stroke();

      // Window Header (Claude)
      ctx.fillStyle = '#f5f5f4';
      ctx.roundRectCustom(660, 100, 580, 40, 12); ctx.fill();
      ctx.fillRect(660, 125, 580, 15);
      
      // Window Dots
      ctx.fillStyle = '#ff5f56'; ctx.beginPath(); ctx.arc(680, 120, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffbd2e'; ctx.beginPath(); ctx.arc(695, 120, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#27c93f'; ctx.beginPath(); ctx.arc(710, 120, 5, 0, Math.PI*2); ctx.fill();

      ctx.font = '700 12px sans-serif';
      ctx.fillStyle = '#d97706';
      ctx.fillText('Claude (claude.ai)', 730, 124);

      // Injected Context Prompt inside Claude Prompt Box
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.2;
      ctx.roundRectCustom(680, 160, 540, 480, 10); ctx.fill(); ctx.stroke();

      ctx.font = '700 12px sans-serif'; ctx.fillStyle = '#d97706';
      ctx.fillText('⚡ INJECTED CONTEXT FROM CONTEXTBRIDGE', 695, 185);

      ctx.font = '500 11px monospace'; ctx.fillStyle = '#d97706';
      ctx.fillText('--- CONTEXTBRIDGE TRANSFER PACKAGE ---', 695, 210);
      ctx.fillStyle = '#334155';
      ctx.fillText('Source: ChatGPT (Build Microservices & JWT Auth Architecture)', 695, 230);
      ctx.fillText('Target Directive: Senior System Architect', 695, 250);
      ctx.fillText('Fidelity Retention: 96% (Smart Compression)', 695, 270);
      ctx.fillText('----------------------------------------------------', 695, 290);
      ctx.fillText('## Executive Summary & Decisions Made:', 695, 315);
      ctx.fillText('- Tech Stack: Node.js, Express, React 19, TypeScript', 695, 335);
      ctx.fillText('- Auth Strategy: JWT stateless tokens with local secret storage', 695, 355);
      ctx.fillText('## Source Code Context:', 695, 380);
      ctx.fillStyle = '#059669';
      ctx.fillText('[code block: typescript]', 695, 400);
      ctx.fillText('app.post("/api/auth", (req, res) => { token = jwt.sign(...) });', 695, 420);
      ctx.fillText('[end code block]', 695, 440);
      ctx.fillStyle = '#d97706';
      ctx.fillText('## Next Action Required:', 695, 470);
      ctx.fillStyle = '#0f172a';
      ctx.fillText('Please review this microservice architecture and optimize security rules.', 695, 490);

      // OVERLAPPING CENTER EXTENSION POPUP CARD (x: 460, y: 180, w: 360, h: 540)
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.15)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.roundRectCustom(460, 180, 360, 540, 16); ctx.fill(); ctx.stroke();
      ctx.restore();

      // Extension Popup Header
      ctx.fillStyle = '#f8fafc';
      ctx.roundRectCustom(460, 180, 360, 50, 16); ctx.fill();
      ctx.fillRect(460, 210, 360, 20);

      drawBridgeIcon(ctx, 480, 205, 24, 1, true);
      ctx.font = '800 15px sans-serif'; ctx.fillStyle = '#0f172a';
      ctx.fillText('ContextBridge', 505, 210);

      // Extension Content
      // Source Detected
      ctx.fillStyle = '#f1f5f9';
      ctx.roundRectCustom(475, 245, 330, 55, 8); ctx.fill();
      ctx.font = '700 10px sans-serif'; ctx.fillStyle = '#10a37f'; ctx.fillText('DETECTED SOURCE', 485, 262);
      ctx.font = '700 12px sans-serif'; ctx.fillStyle = '#0f172a'; ctx.fillText('ChatGPT (18 messages)', 485, 282);

      // Target Selection
      ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1;
      ctx.roundRectCustom(475, 310, 330, 75, 8); ctx.fill(); ctx.stroke();
      ctx.font = '700 10px sans-serif'; ctx.fillStyle = '#d97706'; ctx.fillText('SELECT TARGET AI', 485, 328);

      const miniTargets = [
        { name: 'Claude', sel: true, color: '#d97706' },
        { name: 'Gemini', sel: false, color: '#2563eb' },
        { name: 'DeepSeek', sel: false, color: '#7c3aed' }
      ];
      miniTargets.forEach((t, idx) => {
        const tx = 485 + idx * 105;
        ctx.fillStyle = t.sel ? t.color : '#ffffff';
        ctx.roundRectCustom(tx, 336, 95, 32, 6); ctx.fill();
        ctx.font = '700 11px sans-serif'; ctx.fillStyle = t.sel ? '#ffffff' : '#0f172a';
        ctx.fillText(t.sel ? '✓ ' + t.name : t.name, tx + 12, 356);
      });

      // Role Directive
      ctx.fillStyle = '#f1f5f9';
      ctx.roundRectCustom(475, 395, 330, 55, 8); ctx.fill();
      ctx.font = '700 10px sans-serif'; ctx.fillStyle = '#2563eb'; ctx.fillText('TARGET ROLE DIRECTIVE', 485, 412);
      ctx.font = '700 12px sans-serif'; ctx.fillStyle = '#0f172a'; ctx.fillText('Senior System Architect', 485, 432);

      // Stats
      ctx.font = '700 11px sans-serif'; ctx.fillStyle = '#059669';
      ctx.fillText('⚡ 2,850 Tokens (81.5% Saved • 96% Retention)', 485, 470);

      // Transfer Button
      const bGrad = ctx.createLinearGradient(475, 0, 805, 0);
      bGrad.addColorStop(0, '#2563eb'); bGrad.addColorStop(1, '#059669');
      ctx.fillStyle = bGrad;
      ctx.roundRectCustom(475, 490, 330, 48, 10); ctx.fill();

      ctx.textAlign = 'center';
      ctx.font = '900 14px sans-serif'; ctx.fillStyle = '#ffffff';
      ctx.fillText('Transfer to Claude 🚀', 640, 520);
    }

    // 5. GENERATE SCREENSHOT 2: Privacy Shield (1280x800 - LIGHT THEME)
    function generateScreenshot2() {
      const canvas = document.getElementById('canvas_ss2');
      const ctx = canvas.getContext('2d');
      const w = 1280, h = 800;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      drawScreenshotHeader(ctx, w, 'ContextBridge — 100% Local Privacy Shield & Security', 'SCREENSHOT 2 / 5');

      // Main Card Container (w: 1200, h: 660, x: 40, y: 100)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = 'rgba(5, 150, 105, 0.3)'; ctx.lineWidth = 1.5;
      ctx.roundRectCustom(40, 100, 1200, 660, 16); ctx.fill(); ctx.stroke();

      // Top Security Banner inside Dashboard
      ctx.fillStyle = 'rgba(5, 150, 105, 0.08)';
      ctx.strokeStyle = '#059669'; ctx.lineWidth = 1;
      ctx.roundRectCustom(70, 130, 1140, 60, 12); ctx.fill(); ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = '800 15px sans-serif'; ctx.fillStyle = '#059669';
      ctx.fillText('🛡️ PRIVACY SHIELD ACTIVE — 100% CLIENT-SIDE LOCAL PROCESSING', 95, 166);

      ctx.textAlign = 'right';
      ctx.font = '600 12px sans-serif'; ctx.fillStyle = '#334155';
      ctx.fillText('Zero server calls • Data never leaves browser sandbox', 1180, 166);
      ctx.textAlign = 'left';

      // Two Column Inspection View: Original Raw vs Redacted Output
      // LEFT COLUMN: Raw Sensitive Source (w: 550, h: 420, x: 70, y: 210)
      ctx.fillStyle = '#f8fafc';
      ctx.roundRectCustom(70, 210, 550, 420, 12); ctx.fill();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();

      ctx.font = '700 14px sans-serif'; ctx.fillStyle = '#dc2626';
      ctx.fillText('⚠️ Raw Detected Conversation (Contains Secrets)', 90, 240);

      ctx.fillStyle = '#ffffff';
      ctx.roundRectCustom(90, 260, 510, 350, 8); ctx.fill();
      ctx.strokeStyle = '#fee2e2'; ctx.stroke();

      ctx.font = '500 12px monospace'; ctx.fillStyle = '#334155';
      ctx.fillText('User Prompt:', 105, 290);
      ctx.fillText('Here is our database configuration for production deployment:', 105, 310);
      
      ctx.fillStyle = '#dc2626';
      ctx.fillText('const OPENAI_KEY = "sk-proj-98127391823719823791823";', 105, 340);
      ctx.fillText('const AWS_SECRET = "AKIAIOSFODNN7EXAMPLEKeySecret123";', 105, 365);
      ctx.fillText('const DB_PASSWORD = "SuperSecretProdPassword2026!";', 105, 390);
      ctx.fillText('const JWT_SECRET = "jwt_signing_key_998877665544";', 105, 415);
      
      ctx.fillStyle = '#334155';
      ctx.fillText('Please generate the deployment script for AWS EC2.', 105, 455);

      // RIGHT COLUMN: Redacted Privacy Shield Output (w: 550, h: 420, x: 660, y: 210)
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#059669'; ctx.lineWidth = 1;
      ctx.roundRectCustom(660, 210, 550, 420, 12); ctx.fill(); ctx.stroke();

      ctx.font = '700 14px sans-serif'; ctx.fillStyle = '#059669';
      ctx.fillText('🔒 Sanitized & Redacted Context (Safe to Sync)', 680, 240);

      ctx.fillStyle = '#ffffff';
      ctx.roundRectCustom(680, 260, 510, 350, 8); ctx.fill();
      ctx.strokeStyle = '#d1fae5'; ctx.stroke();

      ctx.font = '500 12px monospace'; ctx.fillStyle = '#334155';
      ctx.fillText('User Prompt:', 695, 290);
      ctx.fillText('Here is our database configuration for production deployment:', 695, 310);
      
      ctx.fillStyle = '#059669';
      ctx.fillText('const OPENAI_KEY = "[REDACTED_API_KEY]";', 695, 340);
      ctx.fillText('const AWS_SECRET = "[REDACTED_AWS_SECRET]";', 695, 365);
      ctx.fillText('const DB_PASSWORD = "[REDACTED_PASSWORD]";', 695, 390);
      ctx.fillText('const JWT_SECRET = "[REDACTED_JWT_SECRET]";', 695, 415);
      
      ctx.fillStyle = '#334155';
      ctx.fillText('Please generate the deployment script for AWS EC2.', 695, 455);

      // Bottom Feature Badges (3 horizontal cards)
      const secBadges = [
        { title: 'Local Storage Sandbox', desc: 'Uses chrome.storage.local exclusively' },
        { title: 'Automatic RegEx Redactor', desc: 'Sanitizes keys, passwords & JWT tokens' },
        { title: 'Zero Cloud Tracking', desc: 'No remote servers or analytics telemetry' }
      ];

      secBadges.forEach((b, i) => {
        const bx = 70 + i * 395;
        ctx.fillStyle = '#f8fafc';
        ctx.roundRectCustom(bx, 650, 360, 80, 10); ctx.fill();
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();

        ctx.font = '700 13px sans-serif'; ctx.fillStyle = '#0f172a';
        ctx.fillText('✓ ' + b.title, bx + 15, 680);
        ctx.font = '500 11px sans-serif'; ctx.fillStyle = '#64748b';
        ctx.fillText(b.desc, bx + 30, 705);
      });
    }

    // 6. GENERATE SCREENSHOT 3: Target Personas (1280x800 - LIGHT THEME)
    function generateScreenshot3() {
      const canvas = document.getElementById('canvas_ss3');
      const ctx = canvas.getContext('2d');
      const w = 1280, h = 800;

      ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, w, h);
      drawScreenshotHeader(ctx, w, 'ContextBridge — Tailored Target AI Role Directives & Personas', 'SCREENSHOT 3 / 5');

      // Left Column: Persona Selector Grid (w: 520, h: 660, x: 40, y: 100)
      ctx.fillStyle = '#ffffff';
      ctx.roundRectCustom(40, 100, 520, 660, 16); ctx.fill();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = '800 16px sans-serif'; ctx.fillStyle = '#2563eb';
      ctx.fillText('SELECT TARGET ROLE DIRECTIVE', 65, 135);

      const personas = [
        { name: 'Senior System Architect', desc: 'Focuses on scalability, system design & high-level architecture decisions.', active: true },
        { name: 'Lead Code Reviewer', desc: 'Focuses on security edge cases, clean code principles & refactoring.', active: false },
        { name: 'Technical Spec Writer', desc: 'Formats context into detailed API documentation & specs.', active: false },
        { name: 'Refactoring Specialist', desc: 'Optimizes runtime performance and reduces technical debt.', active: false }
      ];

      personas.forEach((p, idx) => {
        const py = 160 + idx * 115;
        ctx.fillStyle = p.active ? 'rgba(37, 99, 235, 0.08)' : '#f8fafc';
        ctx.strokeStyle = p.active ? '#2563eb' : '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.roundRectCustom(65, py, 470, 100, 10); ctx.fill(); ctx.stroke();

        ctx.font = '800 14px sans-serif';
        ctx.fillStyle = p.active ? '#2563eb' : '#0f172a';
        ctx.fillText((p.active ? '● ' : '○ ') + p.name, 85, py + 35);

        ctx.font = '500 12px sans-serif'; ctx.fillStyle = '#64748b';
        ctx.fillText(p.desc, 85, py + 65);
      });

      // Right Column: Formatted Prompt Output Preview (w: 660, h: 660, x: 580, y: 100)
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1;
      ctx.roundRectCustom(580, 100, 660, 660, 16); ctx.fill(); ctx.stroke();

      ctx.font = '800 16px sans-serif'; ctx.fillStyle = '#0f172a';
      ctx.fillText('GENERATED PROMPT PREVIEW (FORMATTED FOR TARGET)', 605, 135);

      ctx.fillStyle = '#f8fafc';
      ctx.roundRectCustom(605, 155, 610, 580, 12); ctx.fill();
      ctx.strokeStyle = '#e2e8f0'; ctx.stroke();

      ctx.font = '500 12px monospace'; ctx.fillStyle = '#2563eb';
      ctx.fillText('[SYSTEM ROLE DIRECTIVE]', 625, 185);
      ctx.fillStyle = '#334155';
      ctx.fillText('Act as a Senior System Architect. Analyze the provided context,', 625, 210);
      ctx.fillText('architecture decisions, and code schemas from the previous AI session.', 625, 230);
      ctx.fillText('Provide structured guidance focusing on scalability and clean patterns.', 625, 250);

      ctx.fillStyle = '#7c3aed';
      ctx.fillText('[CONVERSATION CONTEXT & SUMMARY]', 625, 290);
      ctx.fillStyle = '#475569';
      ctx.fillText('• Source AI: ChatGPT (4.0 Turbo)', 625, 315);
      ctx.fillText('• Core Goal: Microservice Auth Architecture', 625, 335);
      ctx.fillText('• Technologies: Node.js, Express, React 19, TypeScript', 625, 355);

      ctx.fillStyle = '#059669';
      ctx.fillText('[CODE SCHEMAS PRESERVED]', 625, 395);
      ctx.fillStyle = '#047857';
      ctx.fillText('interface UserSession { userId: string; role: "admin" | "user"; }', 625, 420);

      ctx.fillStyle = '#d97706';
      ctx.fillText('[NEXT INSTRUCTION]', 625, 460);
      ctx.fillStyle = '#0f172a';
      ctx.fillText('Please review the auth schema above and design the token refresh flow.', 625, 485);
    }

    // 7. GENERATE SCREENSHOT 4: Token Optimization (1280x800 - LIGHT THEME)
    function generateScreenshot4() {
      const canvas = document.getElementById('canvas_ss4');
      const ctx = canvas.getContext('2d');
      const w = 1280, h = 800;

      ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, w, h);
      drawScreenshotHeader(ctx, w, 'ContextBridge — Smart Context Compression & Token Savings', 'SCREENSHOT 4 / 5');

      // Top Metric Cards Row (4 cards)
      const metrics = [
        { label: 'ORIGINAL TOKEN SIZE', val: '15,400 Tokens', col: '#64748b' },
        { label: 'COMPRESSED TOKEN SIZE', val: '2,850 Tokens', col: '#2563eb' },
        { label: 'TOKEN REDUCTION', val: '81.5% Savings', col: '#059669' },
        { label: 'FIDELITY RETENTION', val: '96% Preserved', col: '#7c3aed' }
      ];

      metrics.forEach((m, i) => {
        const mx = 40 + i * 305;
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
        ctx.roundRectCustom(mx, 100, 285, 100, 12); ctx.fill(); ctx.stroke();

        ctx.textAlign = 'left';
        ctx.font = '700 11px sans-serif'; ctx.fillStyle = '#64748b';
        ctx.fillText(m.label, mx + 20, 130);

        ctx.font = '900 22px sans-serif'; ctx.fillStyle = m.col;
        ctx.fillText(m.val, mx + 20, 168);
      });

      // Main Strategy Comparison Panel (w: 1200, h: 540, x: 40, y: 220)
      ctx.fillStyle = '#ffffff';
      ctx.roundRectCustom(40, 220, 1200, 540, 16); ctx.fill();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();

      ctx.font = '800 16px sans-serif'; ctx.fillStyle = '#0f172a';
      ctx.fillText('SELECT COMPRESSION STRATEGY MODE', 70, 260);

      const strategies = [
        { name: '🧠 Smart Compression (Recommended)', token: '~2,850 tokens', pct: '81.5% Saved', desc: 'Extracts core architecture decisions, latest state & active code snippets while stripping filler chat.' },
        { name: '📝 Executive Summary Mode', token: '~1,200 tokens', pct: '92.2% Saved', desc: 'Generates a high-level bulleted summary of key requirements and decisions.' },
        { name: '💻 Code & Schemas Only', token: '~1,800 tokens', pct: '88.3% Saved', desc: 'Isolates all code blocks, type definitions, and data structures.' },
        { name: '📜 Full Raw History', token: '15,400 tokens', pct: '0% Saved', desc: 'Preserves every message word-for-word without any compression.' }
      ];

      strategies.forEach((s, idx) => {
        const sy = 285 + idx * 110;
        const isRec = idx === 0;
        ctx.fillStyle = isRec ? 'rgba(37, 99, 235, 0.08)' : '#f8fafc';
        ctx.strokeStyle = isRec ? '#2563eb' : '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.roundRectCustom(70, sy, 1140, 95, 12); ctx.fill(); ctx.stroke();

        ctx.font = '800 16px sans-serif'; ctx.fillStyle = isRec ? '#2563eb' : '#0f172a';
        ctx.fillText(s.name, 95, sy + 38);

        ctx.font = '700 14px sans-serif'; ctx.fillStyle = '#059669';
        ctx.fillText(s.token + ' (' + s.pct + ')', 850, sy + 38);

        ctx.font = '500 13px sans-serif'; ctx.fillStyle = '#64748b';
        ctx.fillText(s.desc, 95, sy + 68);
      });
    }

    // 8. GENERATE SCREENSHOT 5: Multi-AI Support & Memory Vault (1280x800 - LIGHT THEME)
    function generateScreenshot5() {
      const canvas = document.getElementById('canvas_ss5');
      const ctx = canvas.getContext('2d');
      const w = 1280, h = 800;

      ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, w, h);
      drawScreenshotHeader(ctx, w, 'ContextBridge — Universal AI Model Support & Memory Vault', 'SCREENSHOT 5 / 5');

      // Top Section: 7 Supported AI Platforms Cards (w: 1200, x: 40, y: 100)
      ctx.fillStyle = '#ffffff';
      ctx.roundRectCustom(40, 100, 1200, 130, 16); ctx.fill();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = '800 14px sans-serif'; ctx.fillStyle = '#2563eb';
      ctx.fillText('7 SUPPORTED AI PLATFORMS & LLM PROVIDERS', 65, 130);

      const platforms = [
        { name: 'ChatGPT', sub: 'OpenAI 4o/o1', color: '#10a37f' },
        { name: 'Claude', sub: 'Anthropic 3.5', color: '#d97706' },
        { name: 'Gemini', sub: 'Google 1.5 Pro', color: '#2563eb' },
        { name: 'Grok', sub: 'xAI Grok 2', color: '#475569' },
        { name: 'DeepSeek', sub: 'DeepSeek V3/R1', color: '#7c3aed' },
        { name: 'Copilot', sub: 'Microsoft Copilot', color: '#0284c7' },
        { name: 'Perplexity', sub: 'Sonar Pro', color: '#0891b2' }
      ];

      platforms.forEach((p, i) => {
        const px = 65 + i * 162;
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = p.color; ctx.lineWidth = 1.2;
        ctx.roundRectCustom(px, 145, 150, 68, 10); ctx.fill(); ctx.stroke();

        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(px + 18, 166, 4, 0, Math.PI*2); ctx.fill();
        ctx.font = '700 13px sans-serif'; ctx.fillStyle = '#0f172a'; ctx.fillText(p.name, px + 28, 170);
        ctx.font = '500 10px sans-serif'; ctx.fillStyle = '#64748b'; ctx.fillText(p.sub, px + 15, 195);
      });

      // Bottom Section: Saved Project Memory Vault (w: 1200, h: 510, x: 40, y: 250)
      ctx.fillStyle = '#ffffff';
      ctx.roundRectCustom(40, 250, 1200, 510, 16); ctx.fill();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();

      ctx.font = '800 16px sans-serif'; ctx.fillStyle = '#0f172a';
      ctx.fillText('SAVED PROJECT MEMORY VAULT', 65, 285);
      ctx.font = '500 13px sans-serif'; ctx.fillStyle = '#64748b';
      ctx.fillText('Store & reload key context snapshots across browser sessions instantly', 400, 285);

      const memories = [
        { title: 'SaaS JWT Authentication Architecture', source: 'ChatGPT', tokens: '2,850 tokens', date: 'Just now' },
        { title: 'React 19 & Tailwind Theme Design System', source: 'Claude', tokens: '3,120 tokens', date: '2 hours ago' },
        { title: 'Python Microservice Fast API Specs', source: 'Gemini', tokens: '1,940 tokens', date: 'Yesterday' },
        { title: 'PostgreSQL Database Indexing & Queries', source: 'DeepSeek', tokens: '2,400 tokens', date: '3 days ago' }
      ];

      memories.forEach((m, idx) => {
        const my = 310 + idx * 100;
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
        ctx.roundRectCustom(65, my, 1150, 85, 12); ctx.fill(); ctx.stroke();

        ctx.font = '800 15px sans-serif'; ctx.fillStyle = '#0f172a';
        ctx.fillText(m.title, 90, my + 38);

        ctx.font = '500 12px sans-serif'; ctx.fillStyle = '#64748b';
        ctx.fillText('Source: ' + m.source + ' • ' + m.tokens + ' • Created: ' + m.date, 90, my + 62);

        // Memory Action Buttons
        const btns = ['📋 Copy Prompt', '📤 Export JSON', '🗑️ Delete'];
        btns.forEach((bText, bi) => {
          const bx = 800 + bi * 115;
          ctx.fillStyle = bi === 0 ? '#2563eb' : '#ffffff';
          ctx.roundRectCustom(bx, my + 25, 105, 35, 6); ctx.fill();
          if (bi > 0) { ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.stroke(); }
          ctx.font = '700 11px sans-serif';
          ctx.fillStyle = bi === 0 ? '#ffffff' : '#334155';
          ctx.fillText(bText, bx + 12, my + 47);
        });
      });
    }

    // MAIN RENDER & POST FUNCTION
    async function runGenerator() {
      const statusEl = document.getElementById('status');
      statusEl.innerText = 'Rendering assets on canvases...';

      try {
        generateStoreIcons();
        generateSmallPromo();
        generateMarqueePromo();
        generateScreenshot1();
        generateScreenshot2();
        generateScreenshot3();
        generateScreenshot4();
        generateScreenshot5();

        statusEl.innerText = 'All canvases rendered! Sending base64 data to server...';

        const payloads = {
          icon128: document.getElementById('canvas_icon128').toDataURL('image/png'),
          icon48: document.getElementById('canvas_icon48').toDataURL('image/png'),
          icon32: document.getElementById('canvas_icon32').toDataURL('image/png'),
          icon16: document.getElementById('canvas_icon16').toDataURL('image/png'),
          promo_small: document.getElementById('canvas_promo_small').toDataURL('image/png'),
          promo_marquee: document.getElementById('canvas_promo_marquee').toDataURL('image/png'),
          ss1: document.getElementById('canvas_ss1').toDataURL('image/png'),
          ss2: document.getElementById('canvas_ss2').toDataURL('image/png'),
          ss3: document.getElementById('canvas_ss3').toDataURL('image/png'),
          ss4: document.getElementById('canvas_ss4').toDataURL('image/png'),
          ss5: document.getElementById('canvas_ss5').toDataURL('image/png')
        };

        const res = await fetch('/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloads)
        });

        const result = await res.json();
        if (result.success) {
          statusEl.style.background = '#059669';
          statusEl.innerText = 'SUCCESS! All light theme store assets generated & saved successfully!';
        } else {
          statusEl.style.background = '#dc2626';
          statusEl.innerText = 'Error saving assets: ' + result.error;
        }
      } catch (err) {
        statusEl.style.background = '#dc2626';
        statusEl.innerText = 'Exception during execution: ' + err.toString();
      }
    }

    window.onload = () => {
      setTimeout(runGenerator, 500);
    };
  </script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML_CONTENT);
    return;
  }

  if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        const savePng = (targetPath, base64Data) => {
          const base64Buffer = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64');
          const dir = path.dirname(targetPath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(targetPath, base64Buffer);
          console.log(`Saved: ${targetPath}`);
        };

        // Icons
        savePng(path.join(rootDir, 'public/icons/icon128.png'), data.icon128);
        savePng(path.join(rootDir, 'public/icons/icon48.png'), data.icon48);
        savePng(path.join(rootDir, 'public/icons/icon32.png'), data.icon32);
        savePng(path.join(rootDir, 'public/icons/icon16.png'), data.icon16);

        savePng(path.join(rootDir, 'store-assets/cws_store_icon_128x128.png'), data.icon128);
        savePng(path.join(rootDir, 'store-assets/cws_store_icon_1787382679440.png'), data.icon128);

        // Promo Tiles
        savePng(path.join(rootDir, 'store-assets/cws_promo_small_440x280.png'), data.promo_small);
        savePng(path.join(rootDir, 'store-assets/cws_promo_small_440x280_1787382697746.png'), data.promo_small);

        savePng(path.join(rootDir, 'store-assets/cws_promo_marquee_1400x560.png'), data.promo_marquee);
        savePng(path.join(rootDir, 'store-assets/cws_promo_marquee_1400x560_1787382710675.png'), data.promo_marquee);

        // Screenshots
        savePng(path.join(rootDir, 'store-assets/cws_screenshot1_context_transfer.png'), data.ss1);
        savePng(path.join(rootDir, 'store-assets/cws_screenshot1_context_transfer_1787382726717.png'), data.ss1);

        savePng(path.join(rootDir, 'store-assets/cws_screenshot2_privacy_shield.png'), data.ss2);
        savePng(path.join(rootDir, 'store-assets/cws_screenshot2_privacy_shield_1787382742646.png'), data.ss2);

        savePng(path.join(rootDir, 'store-assets/cws_screenshot3_target_personas.png'), data.ss3);
        savePng(path.join(rootDir, 'store-assets/cws_screenshot3_target_personas_1787382758098.png'), data.ss3);

        savePng(path.join(rootDir, 'store-assets/cws_screenshot4_code_aggregator.png'), data.ss4);
        savePng(path.join(rootDir, 'store-assets/cws_screenshot4_code_aggregator_1787382776299.png'), data.ss4);

        savePng(path.join(rootDir, 'store-assets/cws_screenshot5_multi_ai_support.png'), data.ss5);
        savePng(path.join(rootDir, 'store-assets/cws_screenshot5_multi_ai_support_1787382790950.png'), data.ss5);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));

        setTimeout(() => {
          console.log("All light theme assets written. Closing server.");
          process.exit(0);
        }, 1000);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.toString() }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Asset Generator Server running at http://localhost:${PORT}`);
});
