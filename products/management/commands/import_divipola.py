import csv
from django.core.management.base import BaseCommand, CommandError
from products.models import Department, Municipality


class Command(BaseCommand):
    help = 'Importa municipios y departamentos desde el CSV DIVIPOLA'

    def add_arguments(self, parser):
        parser.add_argument('csv_path', nargs='?', default='DIVIPOLA.csv', type=str)

    def handle(self, *args, **options):
        path = options['csv_path']
        self.stdout.write(f"Importando desde: {path}")
        try:
            with open(path, encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                dept_cache = {}
                count_mun = 0
                for row in reader:
                    dept_code = row['COD_DPTO'].strip()
                    dept_name = row['NOM_DPTO'].strip()
                    mun_code = row['COD_MPIO'].strip()
                    mun_name = row['NOM_MPIO'].strip()
                    lat_raw = row.get('LATITUD', '').strip()
                    lon_raw = row.get('LONGITUD', '').strip()

                    if dept_code not in dept_cache:
                        dept, _ = Department.objects.get_or_create(
                            code=dept_code,
                            defaults={'name': dept_name},
                        )
                        dept_cache[dept_code] = dept
                    else:
                        dept = dept_cache[dept_code]

                    lat = float(lat_raw.replace(',', '.')) if lat_raw else None
                    lon = float(lon_raw.replace(',', '.')) if lon_raw else None

                    Municipality.objects.get_or_create(
                        code=mun_code,
                        defaults={
                            'name': mun_name,
                            'department': dept,
                            'latitude': lat,
                            'longitude': lon,
                        },
                    )
                    count_mun += 1

                self.stdout.write(self.style.SUCCESS(
                    f"Importados {len(dept_cache)} departamentos y {count_mun} municipios"
                ))
        except FileNotFoundError:
            raise CommandError(f"Archivo no encontrado: {path}")
