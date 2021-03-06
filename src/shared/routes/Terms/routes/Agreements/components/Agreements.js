import React, { Component, useEffect } from 'react';

const Agreement = () => {
    useEffect(() => {
        (function (w, d) {
            const loader = function () {
                const s = d.createElement('script');
                const tag = d.getElementsByTagName('script')[0];
                s.src = 'https://cdn.iubenda.com/iubenda.js';
                tag.parentNode.insertBefore(s, tag);
            };
            loader();
        })(window, document);
    }, []);

    return (
        <div>
            <a
                href="https://www.iubenda.com/terms-and-conditions/30255398"
                className="iubenda-nostyle no-brand iubenda-embed iub-body-embed"
                title="Terms and Conditions"
            >
                Terms and Conditions
            </a>
        </div>
    );
};

export default Agreement;
