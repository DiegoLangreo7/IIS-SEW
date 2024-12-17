import xml.etree.ElementTree as ET

def extraer_altimetria(archivoXML):
    """Extrae las distancias y altitudes del archivo XML del circuito."""
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print(f'No se encuentra el archivo {archivoXML}')
        exit()
    except ET.ParseError:
        print(f"Error procesando el archivo XML = {archivoXML}")
        exit()

    raiz = arbol.getroot()
    ns = {'uni': 'http://www.uniovi.es'}
    altimetria = []

    # Extraer las altitudes y distancias
    for tramo in raiz.findall('.//uni:tramos', ns):
        for coord in tramo.findall('.//uni:coordenadas', ns):
            altitud = float(coord.find('uni:altitud', ns).text)
            
            distancia = float(tramo.find('uni:distanciaT/uni:distancia', ns).text)
            altimetria.append((distancia, altitud))
            break
    
    return altimetria

def generar_svg(altimetria, nombreArchivoSVG):
    """Genera un archivo SVG que representa el perfil de altimetría."""
    width = 750
    height = 200  
    distancia_acumulada = 50


    # Crear el contenido SVG
    svg_content = f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
    <polyline points= "50,200 \n\t'''

    for distancia, altitud in altimetria:
        
        distancia_acumulada += distancia / 10
        x = distancia_acumulada
        
        y = (200 - (altitud))
        
        svg_content += f"{x},{y} \n\t" 

    svg_content += f''' {distancia_acumulada+50},200" fill="none" stroke="blue" stroke-width="2"/>'''
    svg_content += f'''
    <polyline points="50,200 {distancia_acumulada+50},200" fill="none" stroke="black" stroke-width="2"/>\n
    </svg>'''

    # Guardar el archivo SVG
    with open(nombreArchivoSVG, 'w') as svg_file:
        svg_file.write(svg_content)
    print(f"Archivo SVG generado: {nombreArchivoSVG}")

def main():
    archivoXML = "circuitoEsquema.xml"  # Cambia el nombre del archivo XML según sea necesario
    nombreSVG = "altimetria.svg"  # Archivo SVG de salida

    # Extraer altimetría
    altimetria = extraer_altimetria(archivoXML)

    # Generar SVG
    generar_svg(altimetria, nombreSVG)

if __name__ == "__main__":
    main()
