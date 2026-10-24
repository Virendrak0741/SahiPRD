# EcoTrace — Cold-Chain Freshness Tracker PRD (v1.2)

## 1. Overview & Vision
EcoTrace provides real-time IoT sensors for refrigerated trucks delivering dairy and fruits across South India. When temperatures fluctuate, warehouse managers get alerted to inspect batches.

### Goals
- Reduce spoilage of perishable greens by 15%.
- Track temperatures via BLE sensors.
- Mobile dashboard for drivers and receiving staff.

## 2. Problem Statement
Cold chain failure causes significant food waste in warm climates. Drivers often turn off vehicle reefer units to save fuel, spoiling milk and ice cream before arrival. Outlets only discover spoilage after opening crates.

## 3. Key Personas
- **Fleet Supervisor**: Wants to see where trucks are and if temperatures stay between 2-8°C.
- **Store Receiver**: Wants to scan a QR code upon unloading to confirm the milk was kept cold.

## 4. MVP Feature Scope
- Real-time temperature ingestion via MQTT.
- Leaflet map showing truck locations.
- Email and SMS alerts when temperature breaches 8°C for > 30 minutes.
- Basic PDF reporting for compliance.

## 5. Technical Architecture
- Node.js backend with Express.
- MongoDB for sensor telemetry timeseries.
- React frontend with Tailwind CSS.
- AWS IoT Core broker.

## 6. Success Metrics
- 99% sensor uptime.
- 500 active sensors deployed in Q1.
- Positive customer feedback from dairy distributors.
