(function () {
  function getTemplateHtml(templateEl) {
    if (templateEl.content) {
      const clone = templateEl.content.cloneNode(true);
      const wrapper = document.createElement('div');
      wrapper.appendChild(clone);
      return wrapper.innerHTML.trim();
    }
    return templateEl.innerHTML.trim();
  }

  function escapeForDisplay(html) {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function openModalWithCode(html) {
    const modal = document.getElementById('code-modal');
    const code = document.getElementById('code-content');
    code.innerHTML = escapeForDisplay(html);
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    const modal = document.getElementById('code-modal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  function copyFrom(codeElementId) {
    const el = document.getElementById(codeElementId);
    const text = el.innerText;
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function generateSingleButtonCode(buttonType, buttonText) {
    const buttonClasses = {
      'classic': 'btn btn-classic',
      'sharp': 'btn btn-sharp',
      'round': 'btn btn-round',
      'cheerful': 'btn btn-cheerful',
      'glowing': 'btn btn-glowing',
      'twisted': 'btn btn-twisted',
      'cut-corner': 'btn btn-cut-corner',
      'informative': 'btn btn-informative',
      'engaging': 'btn btn-engaging',
      'eye-catching': 'btn btn-eye-catching',
      'neon': 'btn btn-neon',
      'metallic': 'btn btn-metallic'
    };

    const className = buttonClasses[buttonType] || 'btn';
    
    // Get the CSS for the specific button type
    const buttonCSS = getButtonCSS(buttonType);
    
    let buttonHTML;
    if (buttonType === 'informative') {
      buttonHTML = `<button class="${className}">
  <span class="btn-tag">FREE TRIAL</span>
  <span class="btn-text">${buttonText}</span>
</button>`;
    } else {
      buttonHTML = `<button class="${className}">${buttonText}</button>`;
    }
    
    return `<style>
${buttonCSS}
</style>

${buttonHTML}`;
  }

  function updateTableWithSelectedButton() {
    if (!selectedButton) return;
    
    const buttonType = selectedButton.getAttribute('data-button-type');
    const buttonText = selectedButton.textContent.trim();
    const claimButtons = document.querySelectorAll('.claim-button');
    
    // Get computed styles from the selected button
    const computedStyles = window.getComputedStyle(selectedButton);
    
    claimButtons.forEach(button => {
      button.className = `claim-button btn btn-${buttonType}`;
      button.textContent = buttonText;
      
      if (buttonType === 'claim-bonus') {
        // Simplified version for table - just text with icon
        button.innerHTML = `🎁 REDEEM BONUS $500`;
        button.style.display = 'inline-block';
        button.style.textAlign = 'center';
        button.style.whiteSpace = 'nowrap';
        button.style.overflow = 'hidden';
        button.style.textOverflow = 'ellipsis';
      }
      
      // Copy exact styles from selected button
      copyButtonStyles(button, selectedButton, computedStyles);
    });
    
    showFeedback('comp-update-table-btn', '✓ Updated!', '#16A34A', '#8B5CF6');
  }

  function copyButtonStyles(targetButton, sourceButton, computedStyles) {
    const buttonType = targetButton.classList.contains('btn-claim-bonus') ? 'claim-bonus' : null;
    
    // Standard sizing for comparison table buttons (different from showcase buttons)
    const tableSizing = {
      width: '100%',
      minHeight: '46px',
      maxHeight: '60px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '700',
      lineHeight: '1.2',
      boxSizing: 'border-box'
    };

    // Special handling for claim bonus button in table
    if (buttonType === 'claim-bonus') {
      tableSizing.padding = '10px 16px';
      tableSizing.fontSize = '13px';
    }

    // Apply table-specific sizing first
    Object.entries(tableSizing).forEach(([prop, value]) => {
      targetButton.style.setProperty(prop, value, 'important');
    });

    // Copy visual styles from source button (colors, effects, etc.)
    const visualProperties = [
      'background', 'backgroundImage', 'backgroundColor',
      'color', 'border', 'borderRadius',
      'fontFamily', 'textTransform', 'letterSpacing',
      'boxShadow', 'transition'
    ];

    visualProperties.forEach(prop => {
      const value = computedStyles.getPropertyValue(prop);
      if (value && value !== 'none' && value !== 'normal' && value !== 'initial') {
        targetButton.style.setProperty(prop, value, 'important');
      }
    });

    // Copy any inline styles from the source button (excluding sizing)
    if (sourceButton.style.cssText) {
      const inlineStyles = sourceButton.style.cssText.split(';');
      inlineStyles.forEach(style => {
        if (style.trim()) {
          const [property, value] = style.split(':');
          if (property && value) {
            const prop = property.trim();
            // Skip sizing properties to maintain standardization
            if (!['width', 'height', 'minHeight', 'maxHeight', 'padding', 'fontSize', 'lineHeight'].includes(prop)) {
              targetButton.style.setProperty(prop, value.trim(), 'important');
            }
          }
        }
      });
    }

    // Ensure proper display and alignment for table context
    targetButton.style.setProperty('display', 'inline-block', 'important');
    targetButton.style.setProperty('text-align', 'center', 'important');
    targetButton.style.setProperty('vertical-align', 'middle', 'important');
    
    // Special styling for claim bonus in table
    if (buttonType === 'claim-bonus') {
      targetButton.style.setProperty('white-space', 'nowrap', 'important');
      targetButton.style.setProperty('overflow', 'hidden', 'important');
      targetButton.style.setProperty('text-overflow', 'ellipsis', 'important');
    }
  }

  function applyButtonStyles(button, buttonType) {
    const styleMap = {
      // Original styles
      'classic': { bg: '#3B82F6', hover: '#1D4ED8', color: '#fff', radius: '12px', padding: '14px 28px' },
      'sharp': { bg: '#000', hover: '#1F2937', color: '#fff', radius: '0', padding: '16px 32px' },
      'round': { bg: '#60A5FA', hover: '#3B82F6', color: '#fff', radius: '50px', padding: '16px 32px' },
      'cheerful': { bg: '#FCD34D', hover: '#F59E0B', color: '#000', radius: '15px', padding: '16px 32px' },
      'glowing': { bg: '#8B5CF6', hover: '#7C3AED', color: '#fff', radius: '15px', padding: '18px 36px' },
      'twisted': { bg: '#F97316', hover: '#EA580C', color: '#fff', radius: '12px', padding: '16px 32px' },
      'cut-corner': { bg: '#1E40AF', hover: '#1D4ED8', color: '#fff', radius: '0', padding: '16px 32px' },
      'claim-bonus': { bg: '#FF6B35', hover: '#F7931E', color: '#fff', radius: '12px', padding: '16px 24px', border: '2px solid #FFD700' },
      'engaging': { bg: '#EC4899', hover: '#BE185D', color: '#fff', radius: '15px', padding: '16px 32px' },
      'eye-catching': { bg: '#8B5CF6', hover: '#7C3AED', color: '#fff', radius: '15px', padding: '18px 36px' },
      'neon': { bg: '#10B981', hover: '#059669', color: '#000', radius: '8px', padding: '16px 32px' },
      'metallic': { bg: '#E5E7EB', hover: '#9CA3AF', color: '#1F2937', radius: '12px', padding: '16px 32px', border: '2px solid #D1D5DB' },
      
      // Casino styles
      'casino-gold': { bg: '#FFD700', hover: '#FFA500', color: '#000', radius: '12px', padding: '14px 28px' },
      'casino-red': { bg: '#DC2626', hover: '#B91C1C', color: '#fff', radius: '12px', padding: '14px 28px' },
      'casino-green': { bg: '#059669', hover: '#047857', color: '#fff', radius: '12px', padding: '14px 28px' },
      'casino-purple': { bg: '#7C3AED', hover: '#6D28D9', color: '#fff', radius: '12px', padding: '14px 28px' },
      'casino-blue': { bg: '#2563EB', hover: '#1D4ED8', color: '#fff', radius: '12px', padding: '14px 28px' },
      'casino-orange': { bg: '#EA580C', hover: '#DC2626', color: '#fff', radius: '12px', padding: '14px 28px' },
      'casino-pink': { bg: '#EC4899', hover: '#DB2777', color: '#fff', radius: '12px', padding: '14px 28px' },
      'casino-gradient': { bg: '#FFD700', hover: '#FF6B35', color: '#fff', radius: '12px', padding: '14px 28px' },
      'casino-neon': { bg: '#00FF88', hover: '#00D4AA', color: '#000', radius: '12px', padding: '14px 28px' },
      
      // Sports styles
      'sports-green': { bg: '#16A34A', hover: '#15803D', color: '#fff', radius: '12px', padding: '14px 28px' },
      'sports-blue': { bg: '#2563EB', hover: '#1D4ED8', color: '#fff', radius: '12px', padding: '14px 28px' },
      'sports-orange': { bg: '#EA580C', hover: '#DC2626', color: '#fff', radius: '12px', padding: '14px 28px' },
      'sports-red': { bg: '#DC2626', hover: '#B91C1C', color: '#fff', radius: '12px', padding: '14px 28px' },
      'sports-purple': { bg: '#7C3AED', hover: '#6D28D9', color: '#fff', radius: '12px', padding: '14px 28px' },
      'sports-yellow': { bg: '#F59E0B', hover: '#D97706', color: '#000', radius: '12px', padding: '14px 28px' },
      'sports-black': { bg: '#1F2937', hover: '#111827', color: '#fff', radius: '12px', padding: '14px 28px' },
      'sports-gradient': { bg: '#16A34A', hover: '#2563EB', color: '#fff', radius: '12px', padding: '14px 28px' },
      
      // Esports styles
      'esports-cyan': { bg: '#06B6D4', hover: '#0891B2', color: '#fff', radius: '12px', padding: '14px 28px' },
      'esports-pink': { bg: '#EC4899', hover: '#DB2777', color: '#fff', radius: '12px', padding: '14px 28px' },
      'esports-green': { bg: '#10B981', hover: '#059669', color: '#fff', radius: '12px', padding: '14px 28px' },
      'esports-orange': { bg: '#F97316', hover: '#EA580C', color: '#fff', radius: '12px', padding: '14px 28px' },
      'esports-purple': { bg: '#8B5CF6', hover: '#7C3AED', color: '#fff', radius: '12px', padding: '14px 28px' },
      'esports-neon': { bg: '#00FF88', hover: '#00D4AA', color: '#000', radius: '12px', padding: '14px 28px' },
      
      // Crypto styles
      'crypto-orange': { bg: '#F97316', hover: '#EA580C', color: '#fff', radius: '12px', padding: '14px 28px' },
      'crypto-dark': { bg: '#1F2937', hover: '#111827', color: '#fff', radius: '12px', padding: '14px 28px' },
      'crypto-blue': { bg: '#3B82F6', hover: '#2563EB', color: '#fff', radius: '12px', padding: '14px 28px' },
      'crypto-green': { bg: '#10B981', hover: '#059669', color: '#fff', radius: '12px', padding: '14px 28px' },
      'crypto-purple': { bg: '#8B5CF6', hover: '#7C3AED', color: '#fff', radius: '12px', padding: '14px 28px' },
      'crypto-gradient': { bg: '#F97316', hover: '#3B82F6', color: '#fff', radius: '12px', padding: '14px 28px' }
    };

    const style = styleMap[buttonType];
    if (!style) return;

    button.style.background = `linear-gradient(135deg, ${style.bg} 0%, ${style.hover} 100%) !important`;
    button.style.color = `${style.color} !important`;
    button.style.borderRadius = style.radius;
    button.style.padding = style.padding;
    button.style.border = style.border || 'none';
    button.style.boxShadow = `0 8px 25px ${style.bg}40`;
  }


  function getButtonCSS(buttonType) {
    const baseCSS = `.btn { display: inline-block; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; cursor: pointer; transition: all 0.3s ease; text-align: center; line-height: 1.2; }`;
    
    const buttonStyles = {
      // Original styles
      'classic': `.btn-classic { background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3); }`,
      'sharp': `.btn-sharp { background: linear-gradient(135deg, #000 0%, #1F2937 100%); color: #fff; border-radius: 0; padding: 16px 32px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); }`,
      'round': `.btn-round { background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%); color: #fff; border-radius: 50px; padding: 16px 32px; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4); }`,
      'cheerful': `.btn-cheerful { background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%); color: #000; border-radius: 15px; padding: 16px 32px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 8px 25px rgba(252, 211, 77, 0.4); }`,
      'glowing': `.btn-glowing { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: #fff; border-radius: 15px; padding: 18px 36px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 16px; box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4), 0 8px 25px rgba(139, 92, 246, 0.5); }`,
      'twisted': `.btn-twisted { background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); color: #fff; border-radius: 12px; padding: 16px 32px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4); }`,
      'cut-corner': `.btn-cut-corner { background: linear-gradient(135deg, #1E40AF 0%, #1D4ED8 100%); color: #fff; border-radius: 0; padding: 16px 32px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4); }`,
      'claim-bonus': `.btn-claim-bonus { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: #fff; border-radius: 12px; padding: 16px 24px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #FFD700; box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4), 0 0 20px rgba(255, 215, 0, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px; } .btn-bonus-icon { font-size: 18px; animation: bounce 1.5s ease-in-out infinite; } .btn-bonus-text { font-weight: 900; font-size: 13px; letter-spacing: 1px; } .btn-bonus-amount { background: rgba(255, 255, 255, 0.2); padding: 4px 8px; border-radius: 6px; font-weight: 900; font-size: 12px; border: 1px solid rgba(255, 255, 255, 0.3); }`,
      'engaging': `.btn-engaging { background: linear-gradient(135deg, #EC4899 0%, #BE185D 100%); color: #fff; border-radius: 15px; padding: 16px 32px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4); }`,
      'eye-catching': `.btn-eye-catching { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: #fff; border-radius: 15px; padding: 18px 36px; font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4); }`,
      'neon': `.btn-neon { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #000; border-radius: 8px; padding: 16px 32px; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3), 0 8px 25px rgba(16, 185, 129, 0.4); }`,
      'metallic': `.btn-metallic { background: linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%); color: #1F2937; border-radius: 12px; padding: 16px 32px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #D1D5DB; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1); }`,
      
      // Casino styles
      'casino-gold': `.btn-casino-gold { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; border-radius: 12px; padding: 14px 28px; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #FF8C00; box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4), 0 0 20px rgba(255, 140, 0, 0.3); }`,
      'casino-red': `.btn-casino-red { background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #991B1B; box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4); }`,
      'casino-green': `.btn-casino-green { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #065F46; box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4); }`,
      'casino-purple': `.btn-casino-purple { background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #5B21B6; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4); }`,
      'casino-blue': `.btn-casino-blue { background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #1E40AF; box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4); }`,
      'casino-orange': `.btn-casino-orange { background: linear-gradient(135deg, #EA580C 0%, #DC2626 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #C2410C; box-shadow: 0 8px 25px rgba(234, 88, 12, 0.4); }`,
      'casino-pink': `.btn-casino-pink { background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #BE185D; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4); }`,
      'casino-gradient': `.btn-casino-gradient { background: linear-gradient(135deg, #FFD700 0%, #FF6B35 50%, #7C3AED 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #FF8C00; box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4); }`,
      'casino-neon': `.btn-casino-neon { background: linear-gradient(135deg, #00FF88 0%, #00D4AA 100%); color: #000; border-radius: 12px; padding: 14px 28px; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #00FF88; box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4), 0 0 20px rgba(0, 255, 136, 0.3); }`,
      
      // Sports styles
      'sports-green': `.btn-sports-green { background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #166534; box-shadow: 0 8px 25px rgba(22, 163, 74, 0.4); }`,
      'sports-blue': `.btn-sports-blue { background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #1E40AF; box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4); }`,
      'sports-orange': `.btn-sports-orange { background: linear-gradient(135deg, #EA580C 0%, #DC2626 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #C2410C; box-shadow: 0 8px 25px rgba(234, 88, 12, 0.4); }`,
      'sports-red': `.btn-sports-red { background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #991B1B; box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4); }`,
      'sports-purple': `.btn-sports-purple { background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #5B21B6; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4); }`,
      'sports-yellow': `.btn-sports-yellow { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #000; border-radius: 12px; padding: 14px 28px; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #B45309; box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4); }`,
      'sports-black': `.btn-sports-black { background: linear-gradient(135deg, #1F2937 0%, #111827 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #000; box-shadow: 0 8px 25px rgba(31, 41, 55, 0.4); }`,
      'sports-gradient': `.btn-sports-gradient { background: linear-gradient(135deg, #16A34A 0%, #2563EB 50%, #DC2626 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #16A34A; box-shadow: 0 8px 25px rgba(22, 163, 74, 0.4); }`,
      
      // Esports styles
      'esports-cyan': `.btn-esports-cyan { background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #0E7490; box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4), 0 0 20px rgba(6, 182, 212, 0.3); }`,
      'esports-pink': `.btn-esports-pink { background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #BE185D; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4); }`,
      'esports-green': `.btn-esports-green { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #047857; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4); }`,
      'esports-orange': `.btn-esports-orange { background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #C2410C; box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4); }`,
      'esports-purple': `.btn-esports-purple { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #6D28D9; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4); }`,
      'esports-neon': `.btn-esports-neon { background: linear-gradient(135deg, #00FF88 0%, #00D4AA 100%); color: #000; border-radius: 12px; padding: 14px 28px; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #00FF88; box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4), 0 0 20px rgba(0, 255, 136, 0.3); }`,
      
      // Crypto styles
      'crypto-orange': `.btn-crypto-orange { background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #C2410C; box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4); }`,
      'crypto-dark': `.btn-crypto-dark { background: linear-gradient(135deg, #1F2937 0%, #111827 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #000; box-shadow: 0 8px 25px rgba(31, 41, 55, 0.4); }`,
      'crypto-blue': `.btn-crypto-blue { background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #1D4ED8; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); }`,
      'crypto-green': `.btn-crypto-green { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #047857; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4); }`,
      'crypto-purple': `.btn-crypto-purple { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #6D28D9; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4); }`,
      'crypto-gradient': `.btn-crypto-gradient { background: linear-gradient(135deg, #F97316 0%, #3B82F6 50%, #10B981 100%); color: #fff; border-radius: 12px; padding: 14px 28px; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #F97316; box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4); }`
    };

    return baseCSS + (buttonStyles[buttonType] || '');
  }

  // Button selection functionality
  let selectedButton = null;

  function showFeedback(elementId, text, successColor, originalColor) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const originalText = element.textContent;
    element.textContent = text;
    element.style.background = `linear-gradient(135deg, ${successColor} 0%, ${successColor}80 100%)`;
    
    setTimeout(() => {
      element.textContent = originalText;
      element.style.background = `linear-gradient(135deg, ${originalColor} 0%, ${originalColor}80 100%)`;
    }, 2000);
  }

  function getThemePath(styleValue) {
    const themeMap = {
      'pokerology': 'themes/pokerology.css',
      'esportsgg': 'themes/esportsgg.css',
      'dotesports': 'themes/dotesports.css'
    };
    return themeMap[styleValue] || 'themes/sunpapers.css';
  }

  document.addEventListener('click', function (e) {
    // Handle button selection
    const selectableBtn = e.target.closest('.btn-selectable');
    if (selectableBtn) {
      document.querySelectorAll('.btn-selectable.selected').forEach(btn => btn.classList.remove('selected'));
      selectableBtn.classList.add('selected');
      selectedButton = selectableBtn;
      
      const downloadBtn = document.getElementById('comp-download-btn-buttons');
      const updateTableBtn = document.getElementById('comp-update-table-btn');
      
      if (downloadBtn) {
        downloadBtn.textContent = 'Download selected button code';
        downloadBtn.style.background = 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)';
      }
      
      if (updateTableBtn) {
        updateTableBtn.style.opacity = '1';
        updateTableBtn.style.pointerEvents = 'auto';
        updateTableBtn.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)';
      }
      
      return;
    }

    // Open modal with code
    const btn = e.target.closest('.download-btn');
    if (btn) {
      // Check if this is the comparison table download button
      if (btn.id === 'comp-download-btn') {
        // Always download table code for comparison table
        const targetId = btn.getAttribute('data-target');
        const tpl = document.getElementById(targetId);
        if (!tpl) return;
        
        const styleValue = (document.getElementById('comp-style-select') || {}).value || 'sun';
        const cssPath = getThemePath(styleValue);
        const baseHtml = getTemplateHtml(tpl);
        openModalWithCode(`<link rel="stylesheet" href="${cssPath}">\n${baseHtml}`);
      } else if (selectedButton && btn.id === 'comp-download-btn-buttons') {
        // Only download button code for the buttons section
        const buttonType = selectedButton.getAttribute('data-button-type');
        const buttonText = selectedButton.textContent.trim();
        openModalWithCode(generateSingleButtonCode(buttonType, buttonText));
      } else {
        // Default behavior for other download buttons
        const targetId = btn.getAttribute('data-target');
        const tpl = document.getElementById(targetId);
        if (!tpl) return;
        
        const styleValue = (document.getElementById('comp-style-select') || {}).value || 'sun';
        const cssPath = getThemePath(styleValue);
        const baseHtml = getTemplateHtml(tpl);
        openModalWithCode(`<link rel="stylesheet" href="${cssPath}">\n${baseHtml}`);
      }
      return;
    }

    // Handle update table button
    const updateTableBtn = e.target.closest('#comp-update-table-btn');
    if (updateTableBtn && selectedButton) {
      updateTableWithSelectedButton();
      return;
    }


    // Close modal
    const close = e.target.closest('[data-close="modal"]');
    if (close) {
      closeModal();
      return;
    }

    // Copy button
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      const target = copyBtn.getAttribute('data-copy-target');
      copyFrom(target).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = original), 1200);
      });
    }
  });

  // Handle double-click to auto-update table
  document.addEventListener('dblclick', function (e) {
    const selectableBtn = e.target.closest('.btn-selectable');
    if (selectableBtn) {
      // First select the button (single click behavior)
      document.querySelectorAll('.btn-selectable.selected').forEach(btn => btn.classList.remove('selected'));
      selectableBtn.classList.add('selected');
      selectedButton = selectableBtn;
      
      const downloadBtn = document.getElementById('comp-download-btn-buttons');
      const updateTableBtn = document.getElementById('comp-update-table-btn');
      
      if (downloadBtn) {
        downloadBtn.textContent = 'Download selected button code';
        downloadBtn.style.background = 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)';
      }
      
      if (updateTableBtn) {
        updateTableBtn.style.opacity = '1';
        updateTableBtn.style.pointerEvents = 'auto';
        updateTableBtn.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)';
      }
      
      // Automatically update the table
      updateTableWithSelectedButton();
    }
  });
  // Live preview CSS file switcher
  function loadThemeCSS(themeName) {
    const link = document.getElementById('theme-stylesheet');
    const buttonsLink = document.getElementById('theme-stylesheet-buttons');
    if (!link) return;
    let cssPath = 'themes/sunpapers.css';
    if (themeName === 'pokerology') cssPath = 'themes/pokerology.css';
    else if (themeName === 'esportsgg') cssPath = 'themes/esportsgg.css';
    else if (themeName === 'dotesports') cssPath = 'themes/dotesports.css';
    link.href = cssPath;
    if (buttonsLink) buttonsLink.href = cssPath;
  }

  const styleSel = document.getElementById('comp-style-select');
  if (styleSel) {
    loadThemeCSS(styleSel.value || 'sun');
    styleSel.addEventListener('change', function () {
      loadThemeCSS(styleSel.value);
    });
  }

})();



