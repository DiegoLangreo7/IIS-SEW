# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET

def extraer_altimetria(archivoXML):
    """Extrae las altitudes del archivo XML del circuito."""
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print('No se encuentra el archivo ', archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()

    raiz = arbol.getroot()
    ns = {'uni': 'http://www.uniovi.es'}
    altimetria = []

    # Extraer las altitudes
    for tramo in raiz.findall('.//uni:tramos', ns):
        for coord in tramo.findall('.//uni:coordenadas', ns):
            altitud = coord.find('uni:altitud', ns).text
            longitud = coord.find('uni:longitud', ns).text
            altimetria.append((float(longitud), float(altitud)))

    return altimetria

def generar_svg(altimetria, nombreArchivoSVG):
    """Genera un archivo SVG que representa el perfil de altimetría."""
    width = 800
    height = 400
    padding = 20
    max_altitude = max(alt[1] for alt in altimetria)

    # Crear el contenido SVG
    svg_content = f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
    <polyline points="'''

    # Normalizar las coordenadas para el SVG
    for longitud, altitud in altimetria:
        x = padding + (longitud * (width - 2 * padding) / max(altimetria[-1][0], 1))  # Normalizar longitud
        y = height - padding - (altitud * (height - 2 * padding) / max_altitude)  # Invertir y normalizar altitud
        svg_content += f"{x},{y} "

    svg_content += '''" fill="none" stroke="blue" stroke-width="2"/>
    <line x1="0" y1="{height - padding}" x2="{width}" y2="{height - padding}" stroke="black" stroke-width="1"/>
    </svg>'''

    # Guardar el archivo SVG
    with open(nombreArchivoSVG, 'w') as svg_file:
        svg_file.write(svg_content)
    print(f"Archivo SVG generado: {nombreArchivoSVG}")

def main():
    archivoXML = "circuitoEsquema.xml"
    nombreSVG = "altimetria.svg"

    # Extraer altimetría
    altimetria = extraer_altimetria(archivoXML)

    # Generar SVG
    generar_svg(altimetria, nombreSVG)

if __name__ == "__main__":
    main()