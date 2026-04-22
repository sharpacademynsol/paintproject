import re

def fix_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            print(f'Fixed in {filepath}')
        else:
            print(f'Pattern not found in {filepath}')
            print('Looking for:', repr(old[:80]))
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Checkout replacements
fix_file('frontend/checkout.html', [
    ('                            <label data-i18n="page.checkout.payment_method.label_2">\n                                    I\u2019ve read and accept the <strong data-i18n="footer.terms_conditions">Terms &amp; Conditions</strong>\n                                </label>',
     '                            <label>\n                                    <span data-i18n="page.checkout.payment_method.label_2">I\u2019ve read and accept the</span> <strong data-i18n="footer.terms_conditions">Terms &amp; Conditions</strong>\n                                </label>'),
])

# Index replacements
fix_file('frontend/index.html', [
    ('<p data-i18n="page.index.banner_img.p_0"><span data-i18n="page.index.banner_img.span_2">800k+</span> Trusted by thousands of satisfied customers</p>',
     '<p><span data-i18n="page.index.banner_img.span_2">800k+</span> <span data-i18n="page.index.banner_img.p_0">Trusted by thousands of satisfied customers</span></p>'),
    ('<h1 class="mb-0 lh-1" data-i18n="page.index.content.h1_0"><span class="counter">30</span>k+</h1>',
     '<h1 class="mb-0 lh-1"><span class="counter">30</span>k+</h1>'),
])

# Test-i18n replacement
fix_file('frontend/test-i18n.html', [
    ('<p class="mb-0 text-white" data-i18n="page.test_i18n.content.p_0">\n                        <span class="text-white" data-i18n="footer.copyright">\u00a9 Qatar Paint.</span> All Rights Reserved\n                    </p>',
     '<p class="mb-0 text-white">\n                        <span class="text-white" data-i18n="footer.copyright">\u00a9 Qatar Paint.</span> All Rights Reserved\n                    </p>'),
])
