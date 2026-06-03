const knownTextFixes: Record<string, string> = {
  "Gasfiter??a": "Gasfitería",
  "GasfiterÃ­a": "Gasfitería",
  "Carpinter??a": "Carpintería",
  "CarpinterÃ­a": "Carpintería",
  "Cerrajer??a": "Cerrajería",
  "CerrajerÃ­a": "Cerrajería",
  "Servicios el??ctricos": "Servicios eléctricos",
  "Servicios elÃ©ctricos": "Servicios eléctricos",
  "T??cnico Demo": "Técnico Demo",
  "TÃ©cnico Demo": "Técnico Demo",
  "Especialista en instalaciones el??ctricas":
    "Especialista en instalaciones eléctricas",
  "Especialista en instalaciones elÃ©ctricas":
    "Especialista en instalaciones eléctricas",
  "Tarapac??": "Tarapacá",
  "TarapacÃ¡": "Tarapacá",
  "Valpara??so": "Valparaíso",
  "ValparaÃ­so": "Valparaíso",
  "O??Higgins": "O'Higgins",
  "Oâ€™Higgins": "O'Higgins",
  "??uble": "Ñuble",
  "Ã‘uble": "Ñuble",
  "Biob??o": "Biobío",
  "BiobÃ­o": "Biobío",
  "La Araucan??a": "La Araucanía",
  "La AraucanÃ­a": "La Araucanía",
  "Los R??os": "Los Ríos",
  "Los RÃ­os": "Los Ríos",
  "Copiap??": "Copiapó",
  "CopiapÃ³": "Copiapó",
  "Vi??a del Mar": "Viña del Mar",
  "ViÃ±a del Mar": "Viña del Mar",
  "Quilpu??": "Quilpué",
  "QuilpuÃ©": "Quilpué",
  "Maip??": "Maipú",
  "MaipÃº": "Maipú",
  "Curic??": "Curicó",
  "CuricÃ³": "Curicó",
  "Chill??n": "Chillán",
  "ChillÃ¡n": "Chillán",
  "Concepci??n": "Concepción",
  "ConcepciÃ³n": "Concepción",
  "Los ??ngeles": "Los Ángeles",
  "Los Ãngeles": "Los Ángeles",
};

export function fixDisplayText(value?: string | null) {
  if (!value) return value ?? "";

  return knownTextFixes[value] || value;
}

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}
