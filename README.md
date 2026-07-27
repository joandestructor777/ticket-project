# 🎫 Sistema de Mesa de Ayuda (HelpDesk System)

Un sistema completo de gestión de solicitudes y tickets de soporte técnico desarrollado con **.NET 8 (Web API)** en el Backend y **React.js** en el Frontend, siguiendo principios de **Clean Architecture**.

---

## 🚀 Historias de Usuario Implementadas

El sistema resuelve tres funcionalidades críticas de automatización y monitoreo:

* ⏱️ **HU-004: Vencimiento Automático de SLA:** Un servicio en segundo plano (*Background Worker*) monitorea continuamente las fechas límite de los tickets activos. Si el tiempo de atención asignado expira, el sistema automáticamente marca el ticket como `Vencido` y registra una alerta con marca de tiempo UTC.
* 🔄 **HU-005: Reapertura de Tickets con Periodo de Gracia:** Permite a los usuarios reabrir tickets resueltos que hayan vuelto a fallar dentro de un plazo configurable (por defecto 48 horas). Si el periodo de gracia expira, el ticket se cierra definitivamente y exige la creación de un nuevo caso.
* 📊 **HU-006: Métricas y Panel de Monitoreo:** Un Dashboard interactivo para supervisores con indicadores clave (tickets resueltos, pendientes, vencidos) y gráficos visuales de cumplimiento de SLA y distribución por categorías.

---

## 🏗️ Arquitectura del Proyecto

```text
HelpDeskSystem/
├── ticket-project/                 # BACKEND (.NET 8 Web API - Clean Architecture)
│   ├── Helpdesk.API/               # Controladores HTTP, Endpoints y Background Workers
│   ├── Helpdesk.Application/       # Lógica de Negocio, Servicios y Reglas (SLA, Reapertura)
│   ├── Helpdesk.Domain/            # Entidades (Ticket, Technician, SystemSetting) e Interfaces
│   └── Helpdesk.Infrastructure/    # Persistencia con Entity Framework Core y SQL
│
└── ticket-project-front/           # FRONTEND (React.js)
    ├── src/features/supervisor/    # Panel de control, estadísticas y gráficos
    ├── src/features/technician/    # Gestión y atención de tickets asignados
    └── src/features/tickets/       # Creación y consulta de solicitudes de usuarios
```

---

## ⚡ Tecnologías Utilizadas

* **Backend:** C# .NET 8, Entity Framework Core, LINQ, Background Services (Hosted Services).
* **Frontend:** React.js, CSS3 Vanilla / Modern UI, Hooks personalizados.
* **Patrones & Principios:** Clean Architecture, Repository Pattern, Dependency Injection, RESTful APIs.

---

## 🛠️ Cómo Ejecutar el Proyecto

### 1. Requisitos Previos
* [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js](https://nodejs.org/) (v16+)

### 2. Ejecutar el Backend (.NET API)
```bash
cd ticket-project/Helpdesk.API
dotnet run
```
La API estará escuchando en `http://localhost:5000` (o el puerto configurado en `launchSettings.json`).

### 3. Ejecutar el Frontend (React)
```bash
cd ticket-project-front
npm install
npm start
```
La aplicación web se abrirá automáticamente en `http://localhost:3000`.
