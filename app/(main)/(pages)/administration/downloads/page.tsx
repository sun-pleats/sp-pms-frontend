'use client';

import { Card } from 'primereact/card';
import React from 'react';

const DownloadsPage = () => {
  return (
    <>
      <section className="py-4">
        <h2 className="doc-section-label">Downloads</h2>
        <div className="doc-section-description mb-3">
          <p>Agents and software downloads.</p>
        </div>

        <Card title="Agents">
          <h3 className="text-lg font-semibold">Sewing Line Agent</h3>
          <p>
            <a href="/installers/sunpleats-scanner-agent.exe">Download here</a> the sewing line agent.
          </p>
          <h3 className="text-lg font-semibold">Printer Agent</h3>
          <p>
            <a href="/installers/sunpleats-printing-agent.exe">Download here</a> the printer agent.
          </p>
        </Card>
      </section>
    </>
  );
};

export default DownloadsPage;
