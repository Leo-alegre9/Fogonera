# Visión del Proyecto — Gallo Negro

## 1. Qué es Gallo Negro

**Estado: [PENDIENTE]**

Aún no se ha relevado con el cliente qué es Gallo Negro como negocio (rubro exacto, historia, público objetivo). Este documento se completará con datos reales durante el Bloque 1 del relevamiento.

## 2. Problema a resolver

**Estado: [CONFIRMADO]** (a nivel de encargo, no de detalle funcional)

Gallo Negro necesita presencia web propia que cumpla, como mínimo, dos funciones:

1. Comunicar institucionalmente el negocio (quiénes son, qué hacen, cómo contactarlos).
2. Exhibir su catálogo de productos de forma que el propio cliente pueda mantenerlo actualizado sin depender de un técnico para cada cambio.

## 3. Qué se va a construir (nivel muy alto)

**Estado: [CONFIRMADO]**

1. Sitio web institucional.
2. Catálogo de productos autogestionable.
3. Panel administrativo para que el propietario administre los productos publicados.
4. Secciones institucionales de presentación del negocio.
5. Información de contacto y canales de comunicación con potenciales clientes.
6. Integración con redes sociales cuando corresponda.

El detalle de cada punto (campos, categorías, reglas, flujos) está **pendiente de relevamiento** y se documentará en `03_Modulos/` a medida que se confirme con el cliente.

## 4. Qué NO es este proyecto (por ahora)

**Estado: [PROPUESTA]** — a confirmar explícitamente con el cliente en el Bloque 1 (ver punto 28 del relevamiento: e-commerce).

- No es un ERP ni un CRM.
- No es, en principio, una tienda de comercio electrónico (sin carrito, sin checkout, sin pagos online) salvo que el cliente lo requiera explícitamente, en cuyo caso se documentará como **cambio de alcance**.
- No es una aplicación desacoplada con API REST pública; ver `DEC-001` en `decisiones.md`.

## 5. Referencia conceptual: CIR

**Estado: [CONFIRMADO]**

Existe un proyecto previo, **Centro Informático Regional (CIR)**, con sitio institucional y catálogo de productos, que sirve **únicamente como referencia conceptual** de cómo puede funcionar un catálogo web (mecánica general: productos, categorías, panel administrativo).

No debe asumirse que Gallo Negro replicará de CIR:

- los mismos módulos;
- las mismas categorías;
- el mismo diseño;
- los mismos campos de producto;
- las mismas reglas de negocio;
- las mismas funcionalidades.

Todo elemento funcional de Gallo Negro debe surgir del relevamiento específico documentado en `01_Relevamiento/`.

## 6. Nivel de complejidad esperado

**Estado: [CONFIRMADO]**

El proyecto se aborda como **sitio institucional + catálogo de productos + administración del catálogo**, sin sobredimensionar arquitectura ni documentación. Se aplican buenas prácticas de ingeniería de software de forma proporcional a esta complejidad (ver `09_Arquitectura/arquitectura-propuesta.md` y el punto "Evitar sobreingeniería" del proceso de trabajo).

## 7. Objetivo de esta etapa

**Estado: [CONFIRMADO]**

Antes de programar, cerrar una especificación de requisitos suficientemente precisa como para saber qué construir, evitar ambigüedades con el cliente, detectar funcionalidades faltantes, controlar cambios de alcance y permitir trazabilidad y mantenimiento futuro. El cierre formal de esta etapa se documenta en `10_Validacion/cierre-requisitos.md`.
