#!/usr/bin/env python3
"""
Complete Emaux Soyer Image Downloader
Downloads ALL high-quality enamel images from the complete product catalog
"""

import os
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from pathlib import Path
import json

class CompleteEmauxDownloader:
    def __init__(self, base_dir="public"):
        self.base_dir = Path(base_dir)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        # Create directories
        self.transparent_dir = self.base_dir / "transparent_colors"
        self.opaque_dir = self.base_dir / "opaques" 
        self.opal_dir = self.base_dir / "opale_colors"
        
        for dir_path in [self.transparent_dir, self.opaque_dir, self.opal_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
            
        self.results = []
        self.stats = {"total": 0, "success": 0, "failed": 0, "skipped": 0}
        self.type_counts = {"transparent": 0, "opaque": 0, "opal": 0, "unknown": 0}

    def extract_color_reference(self, url, title=""):
        """Extract color reference from URL or title"""
        # Try to extract from URL
        patterns = [
            r'(\d+[a-zA-Z]*)-?(?:en-poudre|en-grains|en-morceaux|powder|poudre|150g|150-gr)',
            r'(\d+)-?[fF]?-?(?:en-poudre|en-grains|en-morceaux|powder|poudre)',
            r'([a-zA-Z]+-\d+)',
            r'(\d+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1).upper().replace('-', '')
        
        return None

    def determine_enamel_type(self, url, title="", content=""):
        """Determine if enamel is transparent, opaque, or opal"""
        text = f"{url} {title} {content}".lower()
        
        # Opal indicators
        if any(word in text for word in ['opal', 'opale', 'opalescent']):
            return "opal"
        
        # Transparent indicators  
        if any(word in text for word in ['transparent', 'translucent', 'clear']):
            return "transparent"
        
        # Default to opaque for most standard colors
        return "opaque"

    def get_high_quality_image_url(self, product_url):
        """Extract the highest quality image URL from a product page"""
        try:
            response = self.session.get(product_url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for various image selectors
            image_selectors = [
                'img.product-image-main',
                '.product-image-main img',
                '.fotorama__img', 
                '.gallery-image img',
                'img[src*="catalog/product"]',
                '.product-media img',
                'img[alt*="enamel"]',
                'img[alt*="Enamel"]'
            ]
            
            best_image_url = None
            best_size = 0
            
            for selector in image_selectors:
                images = soup.select(selector)
                for img in images:
                    src = img.get('src') or img.get('data-src')
                    if not src:
                        continue
                        
                    # Skip placeholder images
                    if any(skip in src.lower() for skip in ['placeholder', 'default', 'defaut']):
                        continue
                    
                    # Prefer higher quality versions
                    if 'catalog/product' in src:
                        if not best_image_url or 'cache' in src:
                            best_image_url = urljoin(product_url, src)
                            
            return best_image_url
            
        except Exception as e:
            print(f"Error fetching {product_url}: {e}")
            return None

    def download_image(self, image_url, filename):
        """Download an image file"""
        try:
            response = self.session.get(image_url, timeout=15)
            response.raise_for_status()
            
            with open(filename, 'wb') as f:
                f.write(response.content)
            return True
        except Exception as e:
            print(f"Error downloading {image_url}: {e}")
            return False

    def process_product(self, product_url):
        """Process a single product and download its image"""
        print(f"\nProcessing: {product_url}")
        
        try:
            # Get page content for analysis
            response = self.session.get(product_url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            title = soup.find('title')
            title_text = title.text if title else ""
            
            # Extract color reference
            color_ref = self.extract_color_reference(product_url, title_text)
            if not color_ref:
                print(f"Could not extract color reference from {product_url}")
                return False
            
            # Determine enamel type
            enamel_type = self.determine_enamel_type(product_url, title_text)
            
            # Get directory for this type
            if enamel_type == "transparent":
                target_dir = self.transparent_dir
            elif enamel_type == "opal":
                target_dir = self.opal_dir
            else:
                target_dir = self.opaque_dir
                
            filename = target_dir / f"{color_ref}_hq.jpg"
            
            # Skip if file already exists
            if filename.exists():
                print(f"File already exists: {filename}")
                return True
            
            # Get high-quality image URL
            image_url = self.get_high_quality_image_url(product_url)
            if not image_url:
                print(f"No suitable image found for {product_url}")
                return False
            
            # Download the image
            print(f"Downloading {color_ref} ({enamel_type}): {image_url}")
            if self.download_image(image_url, filename):
                print(f"✓ Saved: {filename}")
                
                # Record result
                self.results.append({
                    "product_url": product_url,
                    "color_reference": color_ref,
                    "enamel_type": enamel_type,
                    "image_url": image_url,
                    "filename": str(filename),
                    "status": "success"
                })
                
                self.type_counts[enamel_type] += 1
                return True
            else:
                return False
                
        except Exception as e:
            print(f"Error processing {product_url}: {e}")
            return False

    def run_complete_download(self):
        """Download all enamel images from the complete product catalog"""
        
        # COMPLETE URL LIST FROM ALL PAGES (1-11)
        all_product_urls = [
            # Pages 1-2 (already processed, but including for completeness)
            "https://www.emaux-soyer.com/en/noir-36-en-poudre.html",
            "https://www.emaux-soyer.com/en/blanc-59-en-grains.html",
            "https://www.emaux-soyer.com/en/bleu-62f-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-66-f-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-68-f-sans-plomb.html",
            "https://www.emaux-soyer.com/en/gris-71-en-poudre.html",
            "https://www.emaux-soyer.com/en/jaune-75-en-poudre.html",
            "https://www.emaux-soyer.com/en/turquoise-80-f-en-poudre.html",
            "https://www.emaux-soyer.com/en/turquoise-81-f-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-83-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-84-en-morceaux.html",
            "https://www.emaux-soyer.com/en/jaune-95-en-poudre.html",
            "https://www.emaux-soyer.com/en/blanc-teinte-97-p.html",
            "https://www.emaux-soyer.com/en/bleu-272-150g.html",
            "https://www.emaux-soyer.com/en/noir-55-f-morceaux.html",
            "https://www.emaux-soyer.com/en/marron-268-150-gr.html",
            "https://www.emaux-soyer.com/en/marron-269-150-gr-750-c-800-c.html",
            "https://www.emaux-soyer.com/en/vert-85-f-poudre-sans-plomb-830.html",
            "https://www.emaux-soyer.com/en/jaune-79-en-poudre-750-c-800-c.html",
            "https://www.emaux-soyer.com/en/rose-283-en-poudre.html",
            "https://www.emaux-soyer.com/en/turquoise-opaque-clair-126.html",
            "https://www.emaux-soyer.com/en/turquoise-opaque-fonce-127.html",
            "https://www.emaux-soyer.com/en/turquoise-271-poudre.html",
            "https://www.emaux-soyer.com/en/noir-56-poudre.html",
            "https://www.emaux-soyer.com/en/rose-299-f-poudre.html",
            
            # Pages 3-11 (new URLs)
            "https://www.emaux-soyer.com/en/jaune-3063-transparent-en-poudre-3444.html",
            "https://www.emaux-soyer.com/en/violet-431-f-powder.html",
            "https://www.emaux-soyer.com/en/rose-2004-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-d-eau-270.html",
            "https://www.emaux-soyer.com/en/fondant-pour-cuivre-n-1-sans-plomb-en-poudre.html",
            "https://www.emaux-soyer.com/en/rubis-31.html",
            "https://www.emaux-soyer.com/en/anis-94-en-poudre.html",
            "https://www.emaux-soyer.com/en/black-55-f-powder.html",
            "https://www.emaux-soyer.com/en/bleu-195-f-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-196-f-poudre.html",
            "https://www.emaux-soyer.com/en/gris-bleu-197-f-en-poudre.html",
            "https://www.emaux-soyer.com/en/gris-bleu-197-f-en-morceaux.html",
            "https://www.emaux-soyer.com/en/gris-bleu-200-poudre.html",
            "https://www.emaux-soyer.com/en/orange-291-en-poudre.html",
            "https://www.emaux-soyer.com/en/rose-297-en-poudre.html",
            "https://www.emaux-soyer.com/en/rose-298-f-en-poudre.html",
            "https://www.emaux-soyer.com/en/rose-298-f-en-morceaux.html",
            "https://www.emaux-soyer.com/en/marron-302-c-en-poudre.html",
            "https://www.emaux-soyer.com/en/gris-304-en-poudre.html",
            "https://www.emaux-soyer.com/en/gris-304-en-grains.html",
            "https://www.emaux-soyer.com/en/gris-304-en-morceaux.html",
            "https://www.emaux-soyer.com/en/marron-307-en-poudre.html",
            "https://www.emaux-soyer.com/en/marron-309-en-poudre.html",
            "https://www.emaux-soyer.com/en/violet-430-f-en-poudre.html",
            "https://www.emaux-soyer.com/en/orange-491-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-marine-605-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-marine-605-en-grains.html",
            "https://www.emaux-soyer.com/en/peche-631-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-anglais-632-en-poudre.html",
            "https://www.emaux-soyer.com/en/lilas-633-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-olive-636-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-olive-636-en-grains.html",
            "https://www.emaux-soyer.com/en/celadon-637-f-en-poudre.html",
            "https://www.emaux-soyer.com/en/celadon-637-f-en-grains.html",
            "https://www.emaux-soyer.com/en/fondant-pour-or-n-2-en-poudre.html",
            "https://www.emaux-soyer.com/en/fondant-pour-argent-n-3-en-morceaux.html",
            "https://www.emaux-soyer.com/en/bleu-4-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-4-en-morceaux.html",
            "https://www.emaux-soyer.com/en/vert-10-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-10-en-grains.html",
            "https://www.emaux-soyer.com/en/vert-10-en-morceaux.html",
            "https://www.emaux-soyer.com/en/gris-bleu-13-en-poudre.html",
            "https://www.emaux-soyer.com/en/jaune-15-en-poudre.html",
            "https://www.emaux-soyer.com/en/violet-20-en-morceaux.html",
            "https://www.emaux-soyer.com/en/bleu-23-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-23-en-morceaux.html",
            "https://www.emaux-soyer.com/en/bleu-25-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-26-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-26-en-grains.html",
            "https://www.emaux-soyer.com/en/bleu-26-en-morceaux.html",
            "https://www.emaux-soyer.com/en/bleu-27-en-grains.html",
            "https://www.emaux-soyer.com/en/jaune-28-en-poudre.html",
            "https://www.emaux-soyer.com/en/jaune-28-en-morceaux.html",
            "https://www.emaux-soyer.com/en/lilas-29-en-poudre.html",
            "https://www.emaux-soyer.com/en/marron-32-en-poudre.html",
            "https://www.emaux-soyer.com/en/marron-32-en-grains.html",
            "https://www.emaux-soyer.com/en/lilas-33-en-poudre.html",
            "https://www.emaux-soyer.com/en/lilas-33-en-morceaux.html",
            "https://www.emaux-soyer.com/en/orange-38-en-poudre.html",
            "https://www.emaux-soyer.com/en/turquoise-45-en-poudre.html",
            "https://www.emaux-soyer.com/en/turquoise-45-en-morceaux.html",
            "https://www.emaux-soyer.com/en/vert-46-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-47-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-49-en-morceaux.html",
            "https://www.emaux-soyer.com/en/vert-50-poudre.html",
            "https://www.emaux-soyer.com/en/vert-51-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-52-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-52-en-morceaux.html",
            "https://www.emaux-soyer.com/en/violet-53-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-100-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-100-en-grains.html",
            "https://www.emaux-soyer.com/en/lilas-111-en-poudre.html",
            "https://www.emaux-soyer.com/en/lilas-111-en-morceaux.html",
            "https://www.emaux-soyer.com/en/vert-119-en-poudre.html",
            "https://www.emaux-soyer.com/en/gris-bleu-161-b-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-163-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-163-en-grains.html",
            "https://www.emaux-soyer.com/en/bleu-163-en-morceaux.html",
            "https://www.emaux-soyer.com/en/marron-172-en-poudre.html",
            "https://www.emaux-soyer.com/en/marron-172-en-grains.html",
            "https://www.emaux-soyer.com/en/marron-173-en-poudre.html",
            "https://www.emaux-soyer.com/en/marron-173-c-en-poudre.html",
            "https://www.emaux-soyer.com/en/marron-clair-174-c-en-poudre.html",
            "https://www.emaux-soyer.com/en/marron-175-en-poudre.html",
            "https://www.emaux-soyer.com/en/marron-176-en-poudre.html",
            "https://www.emaux-soyer.com/en/noir-177-en-poudre.html",
            "https://www.emaux-soyer.com/en/turquoise-185-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-188-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-188-en-grains.html",
            "https://www.emaux-soyer.com/en/vert-189-en-poudre.html",
            "https://www.emaux-soyer.com/en/violet-191-en-poudre.html",
            "https://www.emaux-soyer.com/en/violet-194-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-237-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-238-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-238-b-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-239-en-poudre.html",
            "https://www.emaux-soyer.com/en/turquoise-240-en-grains.html",
            "https://www.emaux-soyer.com/en/bleu-241-en-poudre.html",
            "https://www.emaux-soyer.com/en/bleu-241-en-morceaux.html",
            "https://www.emaux-soyer.com/en/turquoise-250-en-grains.html",
            "https://www.emaux-soyer.com/en/bleu-251-f-poudre.html",
            "https://www.emaux-soyer.com/en/vert-256-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-256-en-morceaux.html",
            "https://www.emaux-soyer.com/en/fondant-de-finition-518-en-poudre.html",
            "https://www.emaux-soyer.com/en/gris-violace-600-en-poudre.html",
            "https://www.emaux-soyer.com/en/gris-vert-601-en-poudre.html",
            "https://www.emaux-soyer.com/en/gris-terre-602-en-poudre.html",
            "https://www.emaux-soyer.com/en/gris-terre-602-en-grains.html",
            "https://www.emaux-soyer.com/en/gris-souris-603-en-poudre.html",
            "https://www.emaux-soyer.com/en/gris-turquoise-604-en-poudre.html",
            "https://www.emaux-soyer.com/en/marron-614-en-poudre.html",
            "https://www.emaux-soyer.com/en/fondant-de-finition-619-en-poudre.html",
            "https://www.emaux-soyer.com/en/fondant-de-finition-619-en-morceaux.html",
            "https://www.emaux-soyer.com/en/orange-620-en-poudre.html",
            "https://www.emaux-soyer.com/en/contre-email-en-poudre.html",
            "https://www.emaux-soyer.com/en/rose-1044-en-poudre.html",
            "https://www.emaux-soyer.com/en/rose-1046-en-poudre.html",
            "https://www.emaux-soyer.com/en/rose-1940-en-poudre.html",
            "https://www.emaux-soyer.com/en/rose-1942-en-poudre.html",
            "https://www.emaux-soyer.com/en/rose-1942-en-morceaux.html",
            "https://www.emaux-soyer.com/en/red-43-powder.html",
            "https://www.emaux-soyer.com/en/rouge-43-poudre-3115.html",
            "https://www.emaux-soyer.com/en/rouge-43-poudre-150-gr.html",
            "https://www.emaux-soyer.com/en/vert-pomme-285.html",
            "https://www.emaux-soyer.com/en/vert-tilleul-286-150g.html",
            "https://www.emaux-soyer.com/en/pourpre-284.html",
            "https://www.emaux-soyer.com/en/blanc-160-en-poudre.html",
            "https://www.emaux-soyer.com/en/fondant-pour-argent-n-3-en-poudre.html",
            "https://www.emaux-soyer.com/en/violet-20-en-poudre.html",
            "https://www.emaux-soyer.com/en/violet-104-en-poudre.html",
            "https://www.emaux-soyer.com/en/turquoise-184-en-poudre.html",
            "https://www.emaux-soyer.com/en/turquoise-240-en-poudre.html",
            "https://www.emaux-soyer.com/en/jaune-30-en-poudre.html",
            "https://www.emaux-soyer.com/en/vert-48-en-poudre.html",
            "https://www.emaux-soyer.com/en/rouge-296-en-poudre.html",
            "https://www.emaux-soyer.com/en/rouge-42-poudre.html",
            "https://www.emaux-soyer.com/en/rouge-288-en-poudre-800-c-840-c.html",
            "https://www.emaux-soyer.com/en/rouge-flamme-287.html",
            "https://www.emaux-soyer.com/en/fondant-pour-cuivre-n-1-en-poudre.html",
            "https://www.emaux-soyer.com/en/red-289-powder.html",
            "https://www.emaux-soyer.com/en/turquoise-273-poudre.html"
        ]
        
        print(f"Starting download of {len(all_product_urls)} product images...")
        
        self.stats["total"] = len(all_product_urls)
        
        for i, url in enumerate(all_product_urls, 1):
            print(f"\n--- Processing {i}/{len(all_product_urls)}: {url} ---")
            
            if self.process_product(url):
                self.stats["success"] += 1
            else:
                self.stats["failed"] += 1
            
            # Rate limiting
            time.sleep(1)
        
        # Generate final report
        self.generate_report()

    def generate_report(self):
        """Generate comprehensive download report"""
        print("\n" + "="*60)
        print("COMPLETE DOWNLOAD REPORT")
        print("="*60)
        
        print(f"Total processed: {self.stats['total']}")
        print(f"Successfully downloaded: {self.stats['success']}")
        print(f"Failed: {self.stats['failed']}")
        print(f"Success rate: {(self.stats['success']/self.stats['total']*100):.1f}%")
        
        print(f"\nBy Type:")
        for enamel_type, count in self.type_counts.items():
            if count > 0:
                print(f"- {enamel_type.title()}: {count}")
        
        # Save detailed JSON report
        report_file = self.base_dir / "complete_download_report.json"
        with open(report_file, 'w') as f:
            json.dump({
                "summary": self.stats,
                "type_counts": self.type_counts,
                "results": self.results
            }, f, indent=2)
        
        print(f"\nDetailed report saved to: {report_file}")


if __name__ == "__main__":
    downloader = CompleteEmauxDownloader()
    downloader.run_complete_download()