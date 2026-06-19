from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle,Paragraph,Spacer
from reportlab.lib.styles import getSampleStyleSheet

fonts = (
        'Courier',                  
        'Courier-Bold',
        'Courier-BoldOblique',
        'Courier-Oblique',
        'Helvetica',
        'Helvetica-Bold',
        'Helvetica-BoldOblique',
        'Helvetica-Oblique',
        'Symbol',
        'Times-Bold',
        'Times-BoldItalic',
        'Times-Italic',
        'Times-Roman',
        'ZapfDingbats'
    )

def create_pdf(info, filename):
    pdf = SimpleDocTemplate(filename, pagesize=letter)
    elements=[]

    title_style = getSampleStyleSheet()["Normal"]
    title_style.alignment = 1
    title_style.fontName = fonts[5]
    title_style.fontSize = 20
    
    # title
    paraghrap = Paragraph("Reporte de consumo y producción de energia", title_style)
    elements.append(paraghrap)
    elements.append(Spacer(0,title_style.fontSize))
    
    consumption = info["consumptions"][0]
    table1 = Table(
        (
            ("Carga","cant","W","W Totales", "Horas de uso", "Energia Total"),
            (consumption["product"],consumption["amount"],consumption["consumption_hour"],consumption["consumption_hour"], consumption["hours_used"], consumption["consumption_day"]),
            (f"Porcentaje de transformacion y perdida { consumption['loss_percentage']}%","-","-","-","",consumption["consumption_for_loss"]),
            ("-","-","-","-","",consumption["total_consumption"]),
        )
    )
    # table
    style = TableStyle([
        ("BACKGROUND",(0,0),(-1,0),colors.skyblue),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('GRID', (0,0), (-1,-1),1,colors.black),
        ('SPAN', (0,2), (-3,3)),
    ])
    table1.setStyle(style)
    elements.append(table1)
    elements.append(Spacer(1,40))
    # title 2
    paraghrap = Paragraph("Cálculo de producción necesaria", title_style)
    elements.append(paraghrap)
    elements.append(Spacer(0,title_style.fontSize))
    
    panel = info["productions"][0]
    # print(info)
    battery = info["others"]["batteries"][0]
    regulator = info["others"]["regulators"][0]
    breaker = info["others"]["breakers"][0]

    

    total_price_panel = panel["price_per_panel"]*panel["amount"]
    total_price_battery = battery["price"]*info["batteries_needed"][0]["amount"]
    total_price_regulator = regulator["price"]*info["regulators_needed"][0]["amount"]
    total_price_breaker = breaker["price"]*info["breakers_needed"][0]["amount"]
    
    table1 = Table(
        (
            ("Elemento","cant","Valor unitario","Total"),
            (panel["panel"],panel["amount"],format_number(panel["price_per_panel"]),format_number(total_price_panel)),
            (battery["name"],info["batteries_needed"][0]["amount"],format_number(battery["price"]),format_number(total_price_battery)),
            (regulator["name"],info["regulators_needed"][0]["amount"],format_number(regulator["price"]),format_number(total_price_regulator)),
            (breaker["name"],info["breakers_needed"][0]["amount"],format_number(breaker["price"]),format_number(total_price_breaker)),
            ("Valor Total",0,0,format_number(total_price_battery+total_price_breaker+total_price_panel+total_price_regulator)),
        )
    )
    style = TableStyle([
        ("BACKGROUND",(0,0),(-1,0),colors.skyblue),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('GRID', (0,0), (-1,-1),1,colors.black),
        ('SPAN', (0,-1), (-2,-1)),
        # ('rowHeights', (0,-1), (-1,-1),50),
        ('FONTNAME', (0,-1), (-1,-1),fonts[5]),
    ])
    table1.setStyle(style)
    elements.append(table1)
    elements.append(Spacer(0,title_style.fontSize))
    
    
    

    # Agregar el elemento Story al PDF y cerrar el archivo
    pdf.build(elements)

def format_number(numero):
    char_counter = 0
    number_str = str(numero)
    final_str = ""
    for i in range(len(number_str),0,-1):
        print(i)
        
        if char_counter==3:
            final_str = "." + final_str
            final_str = number_str[i-1] + final_str
            char_counter=0
        else:
            final_str = number_str[i-1] + final_str
            char_counter+=1
    return final_str
