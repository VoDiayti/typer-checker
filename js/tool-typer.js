// ==UserScript==
// @name         Sprint Typing Auto-Bypass
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  vượt qua anti-cheat.
// @author       Antigravity
// @match        *://localhost/*
// @match        *://localhost:*/*
// @match        *://127.0.0.1/*
// @match        *://127.0.0.1:*/*
// @match        file:///*
// @match        file://*/*
// @match        https://brilliant-banoffee-14d5cc.netlify.app/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Tạo bảng điều khiển Helper
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '99999';
    container.style.background = '#141226';
    container.style.border = '1px solid #2c2848';
    container.style.padding = '12px';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.6)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    container.style.fontFamily = "'Be Vietnam Pro', sans-serif";

    const title = document.createElement('div');
    title.innerText = 'Sprint Typing Helper ⚡';
    title.style.color = '#c6ff3d';
    title.style.fontSize = '13px';
    title.style.fontWeight = '800';
    title.style.letterSpacing = '0.5px';
    container.appendChild(title);

    const btn = document.createElement('button');
    btn.innerText = 'Auto Type (73 WPM)';
    btn.style.background = '#35e8f2';
    btn.style.color = '#0a0912';
    btn.style.border = 'none';
    btn.style.padding = '8px 14px';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = '700';
    btn.style.fontSize = '12px';
    btn.style.transition = '0.2s';
    btn.style.outline = 'none';
    container.appendChild(btn);

    document.body.appendChild(container);

    let isTyping = false;

    btn.addEventListener('click', async () => {
        if (isTyping) {
            isTyping = false;
            return;
        }

        const hi = document.getElementById('hiddenInput');
        if (!hi) {
            alert('Hãy nhấp vào "Bắt đầu" trận đấu trước khi kích hoạt!');
            return;
        }

        // Lấy văn bản đích từ state của ứng dụng
        let targetText = "";
        if (window.state && window.state.currentText) {
            targetText = window.state.currentText;
        } else {
            const textPanel = document.getElementById('textPanel');
            if (textPanel) {
                targetText = textPanel.innerText;
            }
        }

        if (!targetText) {
            alert('Không tìm thấy văn bản thi đấu!');
            return;
        }

        isTyping = true;
        btn.innerText = 'Đang tự gõ... (Bấm để dừng)';
        btn.style.background = '#ff2e92';
        btn.style.color = '#ffffff';

        hi.focus();

        let currentString = "";
        // Mục tiêu WPM ~73 (tốc độ gõ tự nhiên như người thật)
        // Delay trung bình per char = 12000 / 73 = ~164ms
        const baseDelay = 164;

        for (let i = 0; i < targetText.length; i++) {
            if (!isTyping) break;

            const char = targetText[i];

            // 1. Giả lập sự kiện keydown để tăng biến `keystrokes`
            const keyEvent = new KeyboardEvent('keydown', {
                key: char,
                bubbles: true,
                cancelable: true
            });
            hi.dispatchEvent(keyEvent);

            // 2. Điền ký tự tiếp theo vào input
            currentString += char;
            hi.value = currentString;

            // 3. Giả lập sự kiện input để hệ thống tính toán tiến trình gõ
            const inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true
            });
            // Định nghĩa inputType giống như gõ tay thông thường
            Object.defineProperty(inputEvent, 'inputType', { value: 'insertText' });
            hi.dispatchEvent(inputEvent);

            // 4. Trễ nhỏ tạo nhịp điệu giống người gõ thật (+/- 5ms ngẫu nhiên)
            const randomOffset = Math.floor(Math.random() * 11) - 5; // từ -5ms đến +5ms
            const delay = Math.max(20, baseDelay + randomOffset);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        isTyping = false;
        btn.innerText = 'Auto Type (73 WPM)';
        btn.style.background = '#35e8f2';
        btn.style.color = '#0a0912';
    });
})();