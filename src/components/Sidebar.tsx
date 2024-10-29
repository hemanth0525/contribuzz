import React from 'react'
import Script from 'next/script'
import Head from 'next/head'

const Sidebar = () => {
    return (
        <>
            <Head>
                <meta name="google-adsense-account" content="ca-pub-3773415798595784" />
            </Head>
            <aside className="hidden lg:block w-64 overflow-y-auto">
                <div className="sticky top-16 p-4">
                    <div className="bg-cb-bg-light border border-cb-border rounded-lg p-4 mb-4">
                        <h3 className="text-cb-primary font-semibold mb-2">Sponsored</h3>
                        <Script
                            async
                            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_CLIENT_ID"
                            crossOrigin="anonymous"
                        />
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client="ca-pub-YOUR_CLIENT_ID"
                            data-ad-slot="YOUR_AD_SLOT"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar