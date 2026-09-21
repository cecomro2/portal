import type { NextConfig } from "next";

/** Redirecciones 301 de URLs de noticias antiguas (con sufijo aleatorio) a las limpias. */
const postRedirects: { source: string; destination: string; permanent: true }[] = [
  ["/boletin-informativo-edicion-especial-junio-2018-mts7a73er", "/boletin-informativo-edicion-especial-junio-2018"],
  ["/boletin-informativo-mayo-2018-mts7a6ymq", "/boletin-informativo-mayo-2018"],
  ["/boletin-informativo-cecomro-julio-2018-mts7a6u2p", "/boletin-informativo-cecomro-julio-2018"],
  ["/boletin-informativo-cecomro-agosto-2018-mts7a6pio", "/boletin-informativo-cecomro-agosto-2018"],
  ["/boletin-informativo-septiembre-2018-mts7a6kyn", "/boletin-informativo-septiembre-2018"],
  ["/boletin-informativo-octubre-2018-mts7a6g5m", "/boletin-informativo-octubre-2018"],
  ["/boletin-informativo-edicion-especial-inauguracion-de-las-nuevas-oficinas-mts7a6bgl", "/boletin-informativo-edicion-especial-inauguracion-de-las-nuevas-oficinas"],
  ["/boletin-informativo-noviembre-2018-mts7a66pk", "/boletin-informativo-noviembre-2018"],
  ["/boletin-informativo-diciembre-2018-mts7a623j", "/boletin-informativo-diciembre-2018"],
  ["/boletin-informativo-febrero-2019-mts7a5xbi", "/boletin-informativo-febrero-2019"],
  ["/boletin-informativo-enero-2019-mts7a5sfh", "/boletin-informativo-enero-2019"],
  ["/boletin-informativo-febrero-2019-mts7a5nmg", "/boletin-informativo-febrero-2019-2"],
  ["/boletin-informativo-febrero-2019-mts7a5dvf", "/boletin-informativo-febrero-2019-3"],
  ["/boletin-informativo-marzo-2019-mts7a549e", "/boletin-informativo-marzo-2019"],
  ["/boletin-informativo-marzo-2019-mts7a4zmd", "/boletin-informativo-marzo-2019-2"],
  ["/boletin-informativo-cecomro-mayo-2019-mts7a4qlc", "/boletin-informativo-cecomro-mayo-2019"],
  ["/boletin-informativo-junio-2019-mts7a4aab", "/boletin-informativo-junio-2019"],
  ["/boletin-informativo-enero-2020-mts76ibja", "/boletin-informativo-enero-2020"],
  ["/boletin-informativo-febrero-2020-mts75x2j9", "/boletin-informativo-febrero-2020"],
  ["/boletin-informativo-marzo-abril-2020-mts75hrx8", "/boletin-informativo-marzo-abril-2020"],
  ["/boletin-informativo-cecomro-mayo-agosto-2020-mts7559q7", "/boletin-informativo-cecomro-mayo-agosto-2020"],
  ["/presentacion-del-cecomro-a-su-excelentisimo-presidente-de-la-republica-de-panama-muak9f56", "/presentacion-del-cecomro-a-su-excelentisimo-presidente-de-la-republica-de-panama"],
  ["/boletin-informativo-cecomro-septiembre-octubre-noviembre-2020-mts7494q6", "/boletin-informativo-cecomro-septiembre-octubre-noviembre-2020"],
  ["/boletin-informativo-cecomro-enero-febrero-marzo-2021-mts744m05", "/boletin-informativo-cecomro-enero-febrero-marzo-2021"],
  ["/boletin-informativo-cecomro-abril-mayo-junio-2021-mts740864", "/boletin-informativo-cecomro-abril-mayo-junio-2021"],
  ["/boletin-informativo-cecomro-julio-agosto-septiembre-2021-mts72k203", "/boletin-informativo-cecomro-julio-agosto-septiembre-2021"],
  ["/boletin-informativo-cecomro-octubre-noviembre-diciembre-2021-mts71vlh2", "/boletin-informativo-cecomro-octubre-noviembre-diciembre-2021"],
  ["/boletin-informativo-cecomro-enero-febrero-marzo-abril-2022-mts71r321", "/boletin-informativo-cecomro-enero-febrero-marzo-abril-2022"],
  ["/boletin-informativo-cecomro-mayo-junio-julio-y-agosto-2022-mts71ljs0", "/boletin-informativo-cecomro-mayo-junio-julio-y-agosto-2022"],
  ["/lanzamiento-soluciones-integrales-cecomro-kusapin-mts7l3163", "/lanzamiento-soluciones-integrales-cecomro-kusapin"],
  ["/encuentro-de-lideres-y-lideresas-para-fortalecimiento-integral-de-la-gobernanza-y-derechos-humanos-en-la-cnb-con-enfoque-de-genero-mts7l1jm2", "/encuentro-de-lideres-y-lideresas-para-fortalecimiento-integral-de-la-gobernanza-y-derechos-humanos-en-la-cnb-con-enfoque-de-genero"],
  ["/presentacion-de-avances-del-proyecto-soluciones-integrales-de-acceso-universal-a-la-energia-mts7l0d71", "/presentacion-de-avances-del-proyecto-soluciones-integrales-de-acceso-universal-a-la-energia"],
  ["/boletin-informativo-no1-soluciones-integrales-mts7kyaa0", "/boletin-informativo-no1-soluciones-integrales"],
  ["/la-senacyt-y-cecomro-impulsan-la-adopcion-de-la-ia-en-mipymes-del-occidente-del-pais-mubf6068", "/la-senacyt-y-cecomro-impulsan-la-adopcion-de-la-ia-en-mipymes-del-occidente-del-pais"],
  ["/capacitaran-a-empresas-chiricanas-para-optimizar-su-productividad-con-ia-mubegec0", "/capacitaran-a-empresas-chiricanas-para-optimizar-su-productividad-con-ia"],
].map(([source, destination]) => ({ source, destination, permanent: true }));

const nextConfig: NextConfig = {
  async redirects() {
    return postRedirects;
  },
};

export default nextConfig;
