Feature: Validación de Integridad del Sitio CreAI.mx

  Background:
    Given que inicio el monitoreo de errores en consola

  Scenario: Validación de carga de página
    Given navego al sitio "https://www.creai.mx"
    Then el sitio carga exitosamente y retorna estado HTTP 200
    And no hay errores visibles en consola

  Scenario: Elementos clave presentes
    Given navego al sitio "https://www.creai.mx"
    Then validar que el el logo de la marca está visible
    And validar que exista un botón de contacto
    And verificar que al menos 3 secciones visibles carguen correctamente
      | selector | descripcion          |
      | header   | Encabezado Principal |
      | footer   | Pie de Página        |
      | h1       | Título Principal     |

  Scenario: Navegación
    Given navego al sitio "https://www.creai.mx"
    When hago click sobre el link "About us"
    Then verificar que redirige correctamente al url "about-us"

  Scenario: Mobile viewport
    Given simular una prueba con viewport móvil "iPhone X"
    When navego al sitio "https://www.creai.mx"
    Then verificar que al menos 3 secciones visibles carguen correctamente
      | selector | descripcion          |
      | header   | Encabezado Principal |
      | footer   | Pie de Página        |
      | h1       | Título Principal     |