# Documentación del Proyecto — Gallo Negro

Esta carpeta es la **fuente de verdad funcional** del proyecto Gallo Negro. Contiene todo el relevamiento, la especificación de requisitos, el modelado funcional y de datos, los diagramas y la trazabilidad necesarios para construir el sistema sin ambigüedades.

**Regla de la etapa actual:** mientras esta documentación no esté cerrada (ver `10_Validacion/cierre-requisitos.md`), no se escribe código de aplicación. Ver `00_Contexto/alcance.md` y `00_Contexto/decisiones.md` para el marco general.

## Cómo leer esta documentación

El proyecto de referencia conceptual **CIR (Centro Informático Regional)** solo aporta una idea general de cómo funciona un catálogo web. Ningún módulo, campo, categoría o regla de Gallo Negro debe asumirse a partir de CIR: todo debe surgir del relevamiento propio documentado en `01_Relevamiento/`.

## Estructura de carpetas

```text
Docs/
├── README.md                     Este archivo
├── 00_Contexto/                  Visión, alcance, stakeholders, glosario, decisiones
├── 01_Relevamiento/              Cuestionario, respuestas del cliente, supuestos, pendientes
├── 02_Requisitos/                RF, RNF, reglas de negocio, restricciones
├── 03_Modulos/                   Descripción funcional de cada módulo del sistema
├── 04_Modelado_Funcional/        Historias de usuario, casos de uso, actores, criterios de aceptación
├── 05_UX_UI/                     Arquitectura de información, sitemap, navegación, contenido, estilo
├── 06_Modelado_Datos/            Entidades, modelo conceptual, diccionario de datos preliminar
├── 07_Diagramas/                 Diagramas Mermaid (casos de uso, flujos, MER)
├── 08_Trazabilidad/              Matrices de trazabilidad
├── 09_Arquitectura/              Arquitectura técnica propuesta, seguridad, SEO, accesibilidad, rendimiento
└── 10_Validacion/                Checklist de alcance, fuera de alcance, pendientes, cierre de requisitos
```

## Sistema de identificadores

Los identificadores son permanentes: una vez asignados no se reutilizan aunque el elemento se elimine o descarte.

| Prefijo | Significa |
|---|---|
| `RF-XXX` | Requisito funcional |
| `RNF-XXX` | Requisito no funcional |
| `RN-XXX` | Regla de negocio |
| `HU-XXX` | Historia de usuario |
| `CU-XXX` | Caso de uso |
| `CA-XXX` | Criterio de aceptación |
| `DEC-XXX` | Decisión de proyecto |
| `PEN-XXX` | Pregunta pendiente al cliente |

## Estados de la información

Toda afirmación en esta documentación debe llevar una etiqueta de estado:

- `[CONFIRMADO]` — validado explícitamente por el cliente.
- `[PENDIENTE]` — falta consultar al cliente.
- `[PROPUESTA]` — sugerencia nuestra, no decidida aún.
- `[SUPUESTO]` — asunción de trabajo mientras no haya respuesta, debe validarse.
- `[DESCARTADO]` — evaluado y rechazado explícitamente.

## Trazabilidad

Toda funcionalidad debe poder recorrerse de punta a punta:

```text
Necesidad del cliente → Requisito (RF) → Historia de usuario (HU) → Caso de uso (CU)
→ Regla de negocio (RN) → Criterio de aceptación (CA) → Módulo → Implementación → Prueba
```

Por ahora la trazabilidad se sostiene hasta **criterios de aceptación** (`08_Trazabilidad/matriz-trazabilidad.md`). Los eslabones de implementación y prueba se agregarán en la fase de construcción.

## Estado general del proyecto

**Etapa actual:** Relevamiento (Bloque 1 de 8 — ver `01_Relevamiento/cuestionario-cliente.md`).

**Stack tecnológico previsto** *(decisión de proyecto, no depende del cliente)*: Laravel + Inertia.js + React + TypeScript + Tailwind CSS, base de datos MySQL/MariaDB, hosting probable en Hostinger. Ver `00_Contexto/decisiones.md`.

No se ha instalado todavía ninguna dependencia de código (Laravel, React, Inertia, etc.). Este repositorio contiene únicamente documentación hasta que se cierre la etapa de requisitos.
