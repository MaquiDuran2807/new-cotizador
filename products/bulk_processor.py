import re
import json
from collections import defaultdict


def clean_price(price_str):
    if not price_str:
        return None
    prices = re.findall(r"\$\s*([\d.]+)", price_str)
    if prices:
        clean = prices[0].replace(".", "")
        try:
            return int(clean)
        except ValueError:
            return None
    return None


def extract_voltage(desc_str):
    if not desc_str:
        return []
    match = re.search(r"Voltaje:\s*([\d/]+)\s*VDC", desc_str, re.IGNORECASE)
    if match:
        parts = match.group(1).split("/")
        return [int(p) for p in parts if p.strip().isdigit()]
    return []


def extract_consumption(desc_str):
    if not desc_str:
        return None
    match = re.search(r"(\d+)\s*W", desc_str)
    if match:
        return int(match.group(1))
    return None


def extract_product_id_from_filename(filename):
    match = re.match(r"prod_(\d+)_\d+\.\w+", filename, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return None


def normalize_product(json_item):
    normalized = {}

    raw_id = json_item.get("id")
    try:
        normalized["external_id"] = int(raw_id) if raw_id is not None else None
    except (ValueError, TypeError):
        normalized["external_id"] = None
    normalized["name"] = (json_item.get("name") or "").strip()

    price_str = json_item.get("price_formatted") or ""
    normalized["price"] = clean_price(price_str)

    desc = json_item.get("description_short") or ""
    normalized["description"] = desc.strip()
    normalized["voltage_list"] = extract_voltage(desc)
    normalized["consume"] = extract_consumption(desc)

    for key, val in json_item.items():
        if key not in ("id", "name", "price_formatted", "description_short", "description"):
            normalized[key] = val

    return normalized


def match_images_to_products(products, image_files):
    image_map = defaultdict(list)
    for img in image_files:
        pid = extract_product_id_from_filename(img["name"])
        if pid:
            image_map[pid].append(img)

    for product in products:
        pid = product.get("external_id")
        matched = image_map.get(pid)
        if matched is None and pid is not None:
            matched = image_map.get(str(pid))
        if matched is None and pid is not None:
            try:
                matched = image_map.get(int(pid))
            except (ValueError, TypeError):
                pass

        if matched:
            images = sorted(matched, key=lambda x: x["name"])
            product["primary_image"] = images[0] if images else None
            product["additional_images"] = images[1:] if len(images) > 1 else []
        else:
            product["primary_image"] = None
            product["additional_images"] = []

    return products


def process_json_and_images(json_file, image_files=None):
    raw = json.loads(json_file.read().decode("utf-8"))
    items = raw if isinstance(raw, list) else (raw.get("data") or raw.get("products") or [raw])

    normalized_products = []
    for item in items:
        normalized = normalize_product(item)
        normalized_products.append(normalized)

    if image_files:
        normalized_products = match_images_to_products(normalized_products, image_files)

    return normalized_products


def build_summary(products):
    total = len(products)
    with_price = sum(1 for p in products if p.get("price") is not None)
    with_voltage = sum(1 for p in products if p.get("voltage_list"))
    with_consume = sum(1 for p in products if p.get("consume") is not None)
    with_image = sum(1 for p in products if p.get("primary_image"))
    return {
        "total": total,
        "with_price": with_price,
        "with_voltage": with_voltage,
        "with_consume": with_consume,
        "with_image": with_image,
    }
