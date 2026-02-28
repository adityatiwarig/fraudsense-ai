# FraudSense AI

FraudSense AI is a real-time fraud detection web platform that analyzes suspicious text and URLs, generates explainable risk reports, and visualizes live threat intelligence on a dynamic dashboard.

## Why This Product

- Scam detection is usually either black-box AI or rigid rules.
- FraudSense combines both for practical, explainable results.
- Teams can track evolving risk signals in a clear dashboard without technical complexity.

## Key Capabilities

- AI-powered scam analysis with structured output.
- Deterministic risk scoring for consistency and explainability.
- URL-aware enrichment (fetch + signal extraction + content context).
- Dynamic dashboard with:
  - Threat KPIs
  - Average risk tracking
  - Category distribution
  - Recent reports feed
  - High-risk notification panel
- Report lifecycle management:
  - Mark report as `Resolved`
  - Reopen as `Active`
  - Status filters (`All`, `Active`, `Resolved`)
- Mobile-friendly responsive interface across analyzer and dashboard.

## What Makes FraudSense Different

- Hybrid intelligence:
  - AI semantics for context understanding.
  - Deterministic scoring for predictable behavior.
- Human-friendly workflow:
  - Analysts can resolve/reopen reports directly from UI.
  - Status-aware notifications reduce noise.
- Real-time UX:
  - Immediate UI updates after analysis.
  - Continuous sync for dashboard accuracy.

## User Flow

1. Open analyzer and paste suspicious content or URL.
2. Run analysis to get score, confidence, category, reasons, and recommendations.
3. Track generated reports in dashboard and reports table.
4. Use report actions to resolve or reopen incidents.
5. Monitor changing trends and category shifts from overview charts.

## Current Modules

- Analyzer Workbench
- Dashboard Overview
- Reports Management
- Settings & Notification Preferences
- API Endpoints for Analysis, Reports, and Report Status Updates

## Product Direction

- Multi-user incident ownership
- Advanced alert channels (email/chat integrations)
- SOC-style triage pipelines and escalation rules
- Investigation timeline and evidence attachments
