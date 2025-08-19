#!/usr/bin/env python3
"""
Emaux Soyer Image Downloader
Downloads high-quality enamel images from individual product pages
Organized by enamel type (transparent, opaque, opal)
"""

import os
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from pathlib import Path
import json

class EmauxSoyerImageDownloader:
    def __init__(self, base_dir="public"):
        self.base_dir = Path(base_dir)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Create directories
        self.transparent_dir = self.base_dir / "transparent_colors"
        self.opaque_dir = self.base_dir / "opaques" 
        self.opal_dir = self.base_dir / "opale_colors"
        self.samples_dir = self.base_dir / "emaux_soyer_samples"
        
        for directory in [self.transparent_dir, self.opaque_dir, self.opal_dir, self.samples_dir]:
            directory.mkdir(parents=True, exist_ok=True)
        
        # Results tracking
        self.results = {
            "downloaded": [],
            "failed": [],
            "skipped": [],
            "by_type": {
                "transparent": [],
                "opaque": [],
                "opal": [],
                "unknown": []
            }
        }

    def extract_color_info(self, url, title):
        """Extract color number and type from URL and title"""
        # Extract color number from URL or title
        color_match = re.search(r'(\d+)', url.split('/')[-1])
        if not color_match:
            color_match = re.search(r'(\d+)', title)
        
        color_number = color_match.group(1) if color_match else "unknown"
        
        # Determine enamel type based on URL/title patterns
        url_lower = url.lower()
        title_lower = title.lower()
        
        # Enhanced pattern matching for better classification
        if any(keyword in url_lower or keyword in title_lower for keyword in 
               ['transparent', 'trans', 'cristal', 'crystal']):
            enamel_type = "transparent"
        elif any(keyword in url_lower or keyword in title_lower for keyword in 
                ['opal', 'opale']):
            enamel_type = "opal"
        elif any(keyword in url_lower or keyword in title_lower for keyword in 
                ['opaque', 'opaq', 'mat']):
            enamel_type = "opaque"
        else:
            # Enhanced classification based on Emaux Soyer numbering system
            color_num = int(color_number) if color_number.isdigit() else 0
            
            # Transparent ranges (common patterns in Emaux Soyer catalog)
            if (color_num in range(2000, 3000) or 
                color_num in range(4000, 5000) or
                color_num in range(1040, 1050) or
                color_num in [104, 111, 194, 1942, 383, 388, 29, 31, 39, 40, 41, 53]):
                enamel_type = "transparent"
            # Opal ranges
            elif (color_num in range(600, 650) or 
                  color_num in [101, 607, 609, 610, 8]):
                enamel_type = "opal"
            # Default to opaque for standard ranges
            else:
                enamel_type = "opaque"
        
        return color_number, enamel_type

    def get_highest_quality_image(self, product_url):
        """Extract the highest quality image URL from a product page"""
        try:
            print(f"Fetching: {product_url}")
            response = self.session.get(product_url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Get product title for context
            title_elem = soup.find('h1') or soup.find('title')
            title = title_elem.get_text().strip() if title_elem else ""
            
            # Look for product images in multiple possible locations
            image_candidates = []
            
            # Method 1: Look for main product image
            main_img = soup.find('img', {'class': re.compile(r'product.*image|main.*image', re.I)})
            if main_img and main_img.get('src'):
                image_candidates.append(main_img['src'])
            
            # Method 2: Look for images in product gallery
            gallery_imgs = soup.find_all('img', {'class': re.compile(r'gallery|zoom|product', re.I)})
            for img in gallery_imgs:
                if img.get('src'):
                    image_candidates.append(img['src'])
            
            # Method 3: Look for high-res versions (common patterns)
            for img in soup.find_all('img'):
                src = img.get('src', '')
                data_src = img.get('data-src', '')
                data_zoom = img.get('data-zoom-image', '')
                
                # Check for high-resolution indicators
                for url in [src, data_src, data_zoom]:
                    if url and any(indicator in url.lower() for indicator in 
                                 ['large', 'zoom', 'full', 'hd', 'high', 'original']):
                        image_candidates.append(url)
            
            # Method 4: Look for any product-related images
            if not image_candidates:
                for img in soup.find_all('img'):
                    src = img.get('src', '')
                    if src and not any(skip in src.lower() for skip in 
                                     ['logo', 'icon', 'banner', 'nav', 'footer']):
                        image_candidates.append(src)
            
            # Remove duplicates and filter
            image_candidates = list(set(image_candidates))
            
            # Filter out unwanted images
            filtered_candidates = []
            for url in image_candidates:
                if url and not any(skip in url.lower() for skip in 
                                 ['logo', 'icon', 'placeholder', 'banner', 'nav']):
                    filtered_candidates.append(url)
            
            if not filtered_candidates:
                return None, title, "No suitable images found"
            
            # Select the best image (preferably largest or highest quality)
            best_image = None
            best_score = 0
            
            for img_url in filtered_candidates:
                score = 0
                img_url_lower = img_url.lower()
                
                # Scoring based on quality indicators
                if any(qual in img_url_lower for qual in ['large', 'zoom', 'full', 'hd']):
                    score += 10
                if 'product' in img_url_lower:
                    score += 5
                if img_url_lower.endswith(('.jpg', '.jpeg')):
                    score += 3
                elif img_url_lower.endswith('.png'):
                    score += 2
                
                # Prefer longer URLs (often more detailed)
                score += len(img_url) * 0.01
                
                if score > best_score:
                    best_score = score
                    best_image = img_url
            
            if best_image:
                # Convert relative URL to absolute
                if best_image.startswith('//'):
                    best_image = 'https:' + best_image
                elif best_image.startswith('/'):
                    best_image = urljoin(product_url, best_image)
                elif not best_image.startswith('http'):
                    best_image = urljoin(product_url, best_image)
                
                return best_image, title, None
            else:
                return None, title, "No suitable image found after filtering"
                
        except Exception as e:
            return None, "", f"Error fetching page: {str(e)}"

    def download_image(self, image_url, color_number, enamel_type, title):
        """Download an image and save it with appropriate filename"""
        try:
            print(f"Downloading image for color {color_number} ({enamel_type})")
            
            response = self.session.get(image_url, timeout=30)
            response.raise_for_status()
            
            # Determine file extension
            parsed_url = urlparse(image_url)
            file_ext = os.path.splitext(parsed_url.path)[1]
            if not file_ext:
                file_ext = '.jpg'  # Default to jpg
            
            # Create filename
            filename = f"{color_number}_hq{file_ext}"
            
            # Determine target directory
            if enamel_type == "transparent":
                target_dir = self.transparent_dir
            elif enamel_type == "opaque":
                target_dir = self.opaque_dir
            elif enamel_type == "opal":
                target_dir = self.opal_dir
            else:
                target_dir = self.samples_dir
            
            filepath = target_dir / filename
            
            # Save image
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"Saved: {filepath}")
            
            return {
                "color": color_number,
                "type": enamel_type,
                "filename": filename,
                "filepath": str(filepath),
                "title": title,
                "image_url": image_url,
                "file_size": len(response.content)
            }
            
        except Exception as e:
            print(f"Error downloading {image_url}: {str(e)}")
            return None

    def process_product_urls(self, product_urls):
        """Process a list of product URLs"""
        total_urls = len(product_urls)
        
        for i, url in enumerate(product_urls, 1):
            print(f"\n--- Processing {i}/{total_urls}: {url} ---")
            
            # Extract image URL
            image_url, title, error = self.get_highest_quality_image(url)
            
            if error:
                print(f"Failed to get image: {error}")
                self.results["failed"].append({
                    "url": url,
                    "error": error,
                    "title": title
                })
                continue
            
            if not image_url:
                print("No image found")
                self.results["skipped"].append({
                    "url": url,
                    "reason": "No image found",
                    "title": title
                })
                continue
            
            # Extract color info
            color_number, enamel_type = self.extract_color_info(url, title)
            
            # Download image
            download_result = self.download_image(image_url, color_number, enamel_type, title)
            
            if download_result:
                self.results["downloaded"].append(download_result)
                self.results["by_type"][enamel_type].append(download_result)
                print(f"Successfully downloaded: {download_result['filename']}")
            else:
                self.results["failed"].append({
                    "url": url,
                    "error": "Download failed",
                    "title": title,
                    "image_url": image_url
                })
            
            # Be respectful to the server
            time.sleep(1)

    def generate_report(self):
        """Generate a comprehensive download report"""
        report = {
            "summary": {
                "total_processed": len(self.results["downloaded"]) + len(self.results["failed"]) + len(self.results["skipped"]),
                "successful_downloads": len(self.results["downloaded"]),
                "failed_downloads": len(self.results["failed"]),
                "skipped": len(self.results["skipped"])
            },
            "by_type": {
                "transparent": len(self.results["by_type"]["transparent"]),
                "opaque": len(self.results["by_type"]["opaque"]),
                "opal": len(self.results["by_type"]["opal"]),
                "unknown": len(self.results["by_type"]["unknown"])
            },
            "detailed_results": self.results
        }
        
        # Save report to file
        report_file = self.base_dir / "download_report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report

def main():
    # All product URLs from pages 1-11
    product_urls = [
        # Page 1
        "https://www.emaux-soyer.com/en/noir-36-en-poudre.html",
        "https://www.emaux-soyer.com/en/noir-36-en-morceaux.html",
        "https://www.emaux-soyer.com/en/blanc-59-en-grains.html",
        "https://www.emaux-soyer.com/en/blanc-59-p-morceaux.html",
        "https://www.emaux-soyer.com/en/bleu-62f-en-poudre.html",
        "https://www.emaux-soyer.com/en/bleu-66-f-poudre.html",
        "https://www.emaux-soyer.com/en/bleu-66-f-grains.html",
        "https://www.emaux-soyer.com/en/bleu-66-f-morceaux.html",
        "https://www.emaux-soyer.com/en/bleu-68-f-sans-plomb.html",
        "https://www.emaux-soyer.com/en/gris-71-en-poudre.html",
        "https://www.emaux-soyer.com/en/jaune-75-en-poudre.html",
        "https://www.emaux-soyer.com/en/turquoise-80-f-en-poudre.html",
        "https://www.emaux-soyer.com/en/turquoise-81-f-en-poudre.html",
        "https://www.emaux-soyer.com/en/turquoise-81-f-en-morceaux.html",
        "https://www.emaux-soyer.com/en/vert-83-en-poudre.html",
        "https://www.emaux-soyer.com/en/vert-83-en-morceaux.html",
        
        # Page 2
        "https://www.emaux-soyer.com/en/vert-84-en-morceaux.html",
        "https://www.emaux-soyer.com/en/jaune-95-en-poudre.html",
        "https://www.emaux-soyer.com/en/blanc-teinte-97-p.html",
        "https://www.emaux-soyer.com/en/orange-621-150g.html",
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
        "https://www.emaux-soyer.com/en/rose-299-f-poudre.html"
    ]
    
    # Note: You mentioned URLs from pages 3-11 but didn't provide them in the message
    # The script can be easily extended with additional URLs
    
    downloader = EmauxSoyerImageDownloader()
    
    print(f"Starting download of {len(product_urls)} product images...")
    downloader.process_product_urls(product_urls)
    
    print("\n" + "="*60)
    print("GENERATING REPORT...")
    report = downloader.generate_report()
    
    print(f"\nDOWNLOAD COMPLETE!")
    print(f"Total processed: {report['summary']['total_processed']}")
    print(f"Successfully downloaded: {report['summary']['successful_downloads']}")
    print(f"Failed: {report['summary']['failed_downloads']}")
    print(f"Skipped: {report['summary']['skipped']}")
    
    print(f"\nBy Type:")
    print(f"- Transparent: {report['by_type']['transparent']}")
    print(f"- Opaque: {report['by_type']['opaque']}")
    print(f"- Opal: {report['by_type']['opal']}")
    print(f"- Unknown: {report['by_type']['unknown']}")
    
    print(f"\nDetailed report saved to: public/download_report.json")

if __name__ == "__main__":
    main()