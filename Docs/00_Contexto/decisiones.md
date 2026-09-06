# Registro de Decisiones — Gallo Negro

Cada decisión relevante del proyecto se registra aquí con el siguiente formato, y conserva su identificador `DEC-XXX` de forma permanente.

```text
DEC-XXX
Fecha:
Título:
Contexto:
Alternativas:
Decisión:
Motivo:
Impacto:
```

---

## DEC-001

**Fecha:** 2026-09-02
**Título:** Usar Laravel + Inertia.js + React en lugar de frontend y API separados.
**Contexto:** El proyecto requiere backend y frontend integrados para un sitio institucional + catálogo, sin necesidad actual de consumidores externos de datos.
**Alternativas:**
1. Laravel como API REST + SPA React totalmente desacoplada.
2. Laravel + Inertia.js + React (monolito modular, sin API pública).
3. Laravel con Blade tradicional (sin React).
**Decisión:** Laravel (backend) + Inertia.js + React + TypeScript + Tailwind CSS (frontend), sin API REST pública inicial.
**Motivo:** Reduce complejidad de infraestructura y mantenimiento para un sitio de esta envergadura (institucional + catálogo), evita duplicar lógica de autenticación/autorización entre API y SPA, y permite usar React/TypeScript/Tailwind sin pagar el costo de una arquitectura desacoplada que hoy no es necesaria.
**Impacto:** No se expone API REST pública. Si en el futuro surge una necesidad concreta (app móvil, integración externa, terceros consumiendo el catálogo), se evaluará agregar una API REST como extensión, no como reemplazo de esta arquitectura.

---

## DEC-002

**Fecha:** 2026-09-02
**Título:** Ejecutar una fase formal de relevamiento y especificación de requisitos antes de programar.
**Contexto:** El proyecto podría comenzar a implementarse directamente, pero eso arriesga construir sobre supuestos no validados con el cliente, especialmente porque existe un proyecto de referencia (CIR) que podría inducir a copiar módulos o campos no aplicables a Gallo Negro.
**Alternativas:**
1. Empezar a programar directamente iterando con el cliente sobre la marcha.
2. Realizar primero una etapa de relevamiento, requisitos, modelado funcional y trazabilidad, documentada en `/Docs`, y recién luego construir.
**Decisión:** Opción 2. Toda la documentación funcional vive en `/Docs` y se mantiene como fuente de verdad durante todo el ciclo de vida del proyecto.
**Motivo:** Evitar ambigüedades con el cliente, detectar funcionalidades faltantes antes de construir, controlar cambios de alcance y dejar trazabilidad completa desde la necesidad del cliente hasta los criterios de aceptación.
**Impacto:** No se escribirá código de aplicación (controllers, models, migrations, componentes React, rutas productivas, etc.) hasta que `10_Validacion/cierre-requisitos.md` esté completo y validado.

---

## DEC-003

**Fecha:** 2026-09-02
**Título:** CIR se usa solo como referencia conceptual, nunca como plantilla de requisitos.
**Contexto:** Existe el proyecto Centro Informático Regional (CIR), con sitio institucional y catálogo, que podría tentar a reutilizar directamente su estructura de módulos, campos y reglas.
**Alternativas:**
1. Adaptar directamente los módulos y el modelo de datos de CIR a Gallo Negro.
2. Usar CIR solo como referencia de mecánica general (cómo funciona un catálogo web) y relevar Gallo Negro desde cero.
**Decisión:** Opción 2.
**Motivo:** Gallo Negro es un negocio distinto, con productos, público y necesidades propias; asumir la estructura de CIR generaría requisitos ficticios no validados por el cliente real.
**Impacto:** Todo módulo, entidad, campo o regla de negocio de Gallo Negro debe estar respaldado por el relevamiento en `01_Relevamiento/`, nunca inferido de CIR.

---

## DEC-004

**Fecha:** 2026-09-02
**Título:** Base de datos: MySQL o MariaDB, definición final pendiente de entorno de hosting.
**Contexto:** El hosting previsto es Hostinger, cuyos planes suelen ofrecer MySQL/MariaDB de forma estándar.
**Alternativas:**
1. Definir motor de base de datos ahora, sin conocer el entorno definitivo de hosting.
2. Confirmar preferencia (MySQL o MariaDB) más adelante, cuando se conozca el entorno definitivo de despliegue.
**Decisión:** Opción 2. Se documenta como preferencia general "MySQL o MariaDB" hasta tener el entorno de hosting confirmado.
**Motivo:** No hay necesidad de comprometer esta decisión durante la etapa de requisitos; no afecta el modelado conceptual de datos.
**Impacto:** `06_Modelado_Datos/` se mantiene agnóstico de motor específico. La decisión final se registrará como `DEC-XXX` adicional en la fase de arquitectura/despliegue.

---

## DEC-005

**Fecha:** 2026-09-02
**Título:** Alcance por defecto: catálogo de productos, no comercio electrónico.
**Contexto:** El encargo actual se describe como "catálogo de productos autogestionable", lo cual es distinto de una tienda con compra y pago online.
**Alternativas:**
1. Asumir e-commerce completo (carrito, checkout, pagos) desde el inicio.
2. Asumir catálogo informativo con consulta (ej. vía WhatsApp), sin compra online, y tratar cualquier pedido de e-commerce como cambio de alcance a evaluar.
**Decisión:** Opción 2, sujeta a confirmación explícita del cliente en el relevamiento (ver punto 28 del cuestionario, `PEN-` correspondiente en `preguntas-pendientes.md`).
**Motivo:** Evitar sobreingeniería y construir funcionalidad de e-commerce (carrito, checkout, pagos, pedidos, envíos, facturación, cuentas de clientes) que no fue solicitada y que incrementaría significativamente costo, complejidad y superficie de seguridad.
**Impacto:** Estas funcionalidades quedan registradas como fuera de alcance en `10_Validacion/fuera-de-alcance.md` hasta que el cliente indique explícitamente lo contrario, momento en el cual se marcarán como **CAMBIO DE ALCANCE** y se re-evaluarán.
