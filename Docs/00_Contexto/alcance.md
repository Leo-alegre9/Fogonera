# Alcance del Proyecto — Gallo Negro

Este documento se irá refinando a medida que avance el relevamiento. La versión de cierre definitiva vivirá en `10_Validacion/cierre-requisitos.md`; hasta entonces, este archivo refleja el alcance **conocido hasta el momento**.

## 1. Incluido en el alcance (nivel macro)

**Estado: [CONFIRMADO]** a nivel de macro-módulo; el detalle interno de cada uno está `[PENDIENTE]` de relevamiento.

| Macro-módulo | Descripción | Detalle |
|---|---|---|
| Sitio institucional | Páginas de presentación de la empresa (inicio, nosotros, etc.) | `03_Modulos/sitio-institucional.md` |
| Catálogo de productos | Exhibición pública de productos, navegable y buscable | `03_Modulos/catalogo-productos.md` |
| Administración del catálogo | Panel para que el propietario cargue/edite/publique productos | `03_Modulos/administracion-catalogo.md` |
| Contacto y comunicación | Vías de contacto: WhatsApp, formulario, teléfono, redes, ubicación | `03_Modulos/contacto.md` |
| Configuración del sitio | Datos institucionales editables (teléfonos, horarios, redes, etc.) | `03_Modulos/configuracion-sitio.md` — alcance de qué es editable está `[PENDIENTE]` |

## 2. Explícitamente fuera de alcance (mientras no se indique lo contrario)

**Estado: [PROPUESTA]** — a confirmar en el Bloque 1/8 del relevamiento (punto 28, e-commerce).

Salvo que el cliente lo solicite expresamente (lo cual se registraría como **cambio de alcance**), quedan fuera:

- Carrito de compras.
- Checkout / pago online (Mercado Pago, tarjetas, etc.).
- Gestión de pedidos y envíos.
- Facturación electrónica.
- Cuentas de clientes / login de usuarios finales.
- Gestión avanzada de stock (control de inventario transaccional).
- Aplicación móvil nativa.
- Integración con ERP externo.
- Múltiples sucursales con lógicas diferenciadas.
- API REST pública (ver `DEC-001`).

El detalle y las condiciones de descarte de cada ítem se registran en `10_Validacion/fuera-de-alcance.md` a medida que se confirman.

## 3. MVP vs. futuro

**Estado: [PENDIENTE]** de definición fina; se completará una vez cerrado el relevamiento de catálogo, administración y requisitos no funcionales.

- **MVP:** lo estrictamente necesario para cumplir el encargo actual (sitio institucional + catálogo + panel administrativo básico + contacto/WhatsApp).
- **Futuro (fuera del contrato actual):** ideas que podrían evaluarse más adelante — e-commerce, cuentas de clientes, wishlist, comparador de productos, app móvil, integración ERP, multi-sucursal. Ninguna de estas entra automáticamente al alcance actual.

## 4. Criterio de control de cambios de alcance

**Estado: [CONFIRMADO]** (regla de trabajo del proyecto)

Cualquier funcionalidad solicitada durante el relevamiento o la construcción que no esté cubierta por este documento debe:

1. Marcarse explícitamente como **CAMBIO DE ALCANCE**.
2. No implementarse hasta ser evaluada y aceptada.
3. Registrarse en `00_Contexto/decisiones.md` si se aprueba, o en `10_Validacion/fuera-de-alcance.md` si se descarta.

## 5. Referencias

- Visión general: `00_Contexto/vision-proyecto.md`
- Decisiones técnicas y de alcance: `00_Contexto/decisiones.md`
- Cuestionario en curso: `01_Relevamiento/cuestionario-cliente.md`
- Preguntas abiertas: `01_Relevamiento/preguntas-pendientes.md`
