const fs = require('fs');
const path = require('path');

// Read existing products
const productsPath = path.join(__dirname, '../data/sample-products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('🔧 Creating unique relatable Indian names for clothing products...\n');

let updatedCount = 0;

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Comprehensive Indian names based on color and product type
const indianNames = {
  // Saree names
  saree: {
    blue: [
      'Neel Kamal Saree', 'Indira Sagar Saree', 'Ganga Jal Saree', 'Krishna Neel Saree', 'Shyam Sundar Saree',
      'Neel Ganga Saree', 'Indira Neel Saree', 'Krishna Jal Saree', 'Shyam Kamal Saree', 'Neel Sagar Saree',
      'Blue Lotus Saree', 'Ocean Blue Saree', 'Sky Blue Saree', 'Royal Blue Saree', 'Midnight Blue Saree',
      'Azure Dreams Saree', 'Sapphire Silk Saree', 'Cobalt Grace Saree', 'Navy Elegance Saree', 'Turquoise Beauty Saree'
    ],
    green: [
      'Hari Priya Saree', 'Meera Mal Saree', 'Sita Van Saree', 'Radha Vatika Saree', 'Priya Vana Saree',
      'Hari Van Saree', 'Meera Vatika Saree', 'Sita Priya Saree', 'Radha Mal Saree', 'Priya Hari Saree',
      'Emerald Forest Saree', 'Jade Garden Saree', 'Mint Fresh Saree', 'Olive Grace Saree', 'Sage Wisdom Saree',
      'Forest Green Saree', 'Moss Green Saree', 'Lime Blossom Saree', 'Teal Tranquility Saree', 'Pistachio Dreams Saree'
    ],
    red: [
      'Rani Roop Saree', 'Lalita Devi Saree', 'Kumari Kala Saree', 'Rajni Raga Saree', 'Surya Kiran Saree',
      'Rani Devi Saree', 'Lalita Roop Saree', 'Kumari Raga Saree', 'Rajni Kala Saree', 'Surya Devi Saree',
      'Crimson Queen Saree', 'Ruby Radiance Saree', 'Scarlet Grace Saree', 'Burgundy Beauty Saree', 'Cherry Blossom Saree',
      'Rose Red Saree', 'Wine Red Saree', 'Coral Charm Saree', 'Maroon Majesty Saree', 'Garnet Glory Saree'
    ],
    pink: [
      'Gulabi Ganga Saree', 'Pink Palace Saree', 'Rose Garden Saree', 'Kamal Nayan Saree', 'Pari Priya Saree',
      'Gulabi Palace Saree', 'Pink Garden Saree', 'Rose Nayan Saree', 'Kamal Priya Saree', 'Pari Ganga Saree',
      'Blush Pink Saree', 'Peach Blossom Saree', 'Rose Petal Saree', 'Coral Pink Saree', 'Dusty Rose Saree',
      'Magenta Magic Saree', 'Fuchsia Fantasy Saree', 'Salmon Silk Saree', 'Bubblegum Beauty Saree', 'Cotton Candy Saree'
    ],
    purple: [
      'Rajni Purple Saree', 'Neel Kamal Saree', 'Indira Mahal Saree', 'Violet Vatika Saree', 'Purple Palace Saree',
      'Rajni Violet Saree', 'Neel Purple Saree', 'Indira Violet Saree', 'Violet Palace Saree', 'Purple Vatika Saree',
      'Royal Purple Saree', 'Lavender Dreams Saree', 'Plum Perfection Saree', 'Amethyst Aura Saree', 'Mauve Magic Saree',
      'Orchid Opulence Saree', 'Lilac Luxury Saree', 'Grape Glory Saree', 'Eggplant Elegance Saree', 'Violet Velvet Saree'
    ],
    yellow: [
      'Surya Kiran Saree', 'Golden Ganga Saree', 'Chandni Chowk Saree', 'Sita Surya Saree', 'Priya Prakash Saree',
      'Surya Ganga Saree', 'Golden Kiran Saree', 'Chandni Surya Saree', 'Sita Prakash Saree', 'Priya Chowk Saree',
      'Sunshine Yellow Saree', 'Golden Glory Saree', 'Mustard Magic Saree', 'Lemon Lime Saree', 'Buttercup Beauty Saree',
      'Marigold Majesty Saree', 'Saffron Silk Saree', 'Honey Gold Saree', 'Amber Aura Saree', 'Citrine Charm Saree'
    ],
    maroon: [
      'Rajni Raga Saree', 'Deepa Devi Saree', 'Kumari Kala Saree', 'Rani Roop Saree', 'Lalita Mahal Saree',
      'Rajni Devi Saree', 'Deepa Raga Saree', 'Kumari Roop Saree', 'Rani Mahal Saree', 'Lalita Kala Saree',
      'Burgundy Beauty Saree', 'Wine Red Saree', 'Mahogany Magic Saree', 'Chestnut Charm Saree', 'Crimson Crown Saree',
      'Ruby Red Saree', 'Garnet Glory Saree', 'Maroon Majesty Saree', 'Brick Red Saree', 'Oxblood Opulence Saree'
    ],
    black: [
      'Kali Mata Saree', 'Shyam Sundar Saree', 'Neel Kamal Saree', 'Indira Sagar Saree', 'Ganga Jal Saree',
      'Kali Sundar Saree', 'Shyam Mata Saree', 'Neel Kali Saree', 'Indira Kali Saree', 'Ganga Mata Saree',
      'Midnight Black Saree', 'Ebony Elegance Saree', 'Onyx Opulence Saree', 'Raven Beauty Saree', 'Charcoal Charm Saree',
      'Jet Black Saree', 'Obsidian Grace Saree', 'Coal Beauty Saree', 'Soot Silk Saree', 'Pitch Perfect Saree'
    ],
    white: [
      'Ganga Jal Saree', 'Chandni Chowk Saree', 'Sita Van Saree', 'Priya Prakash Saree', 'Neel Kamal Saree',
      'Ganga Chowk Saree', 'Chandni Jal Saree', 'Sita Prakash Saree', 'Priya Van Saree', 'Neel Ganga Saree',
      'Pearl White Saree', 'Ivory Dreams Saree', 'Snow White Saree', 'Cream Silk Saree', 'Milk White Saree',
      'Alabaster Aura Saree', 'Chalk White Saree', 'Bone White Saree', 'Off White Saree', 'Vanilla Cream Saree'
    ],
    multicolor: [
      'Rangoli Raga Saree', 'Indira Mahal Saree', 'Rajni Roop Saree', 'Priya Vatika Saree', 'Sita Sagar Saree',
      'Rangoli Mahal Saree', 'Indira Raga Saree', 'Rajni Vatika Saree', 'Priya Sagar Saree', 'Sita Raga Saree',
      'Rainbow Radiance Saree', 'Prism Perfection Saree', 'Spectrum Silk Saree', 'Ombre Opulence Saree', 'Gradient Glory Saree',
      'Tie Dye Dreams Saree', 'Color Burst Saree', 'Vibrant Vision Saree', 'Hue Harmony Saree', 'Chroma Charm Saree'
    ]
  },
  // Kurti/Anarkali names
  kurti: {
    blue: [
      'Neel Kamal Kurti', 'Indira Sagar Kurti', 'Ganga Jal Kurti', 'Krishna Neel Kurti', 'Shyam Sundar Kurti',
      'Neel Ganga Kurti', 'Indira Neel Kurti', 'Krishna Jal Kurti', 'Shyam Kamal Kurti', 'Neel Sagar Kurti',
      'Blue Lotus Kurti', 'Ocean Blue Kurti', 'Sky Blue Kurti', 'Royal Blue Kurti', 'Midnight Blue Kurti',
      'Azure Dreams Kurti', 'Sapphire Silk Kurti', 'Cobalt Grace Kurti', 'Navy Elegance Kurti', 'Turquoise Beauty Kurti'
    ],
    green: [
      'Hari Priya Kurti', 'Meera Mal Kurti', 'Sita Van Kurti', 'Radha Vatika Kurti', 'Priya Vana Kurti',
      'Hari Van Kurti', 'Meera Vatika Kurti', 'Sita Priya Kurti', 'Radha Mal Kurti', 'Priya Hari Kurti',
      'Emerald Forest Kurti', 'Jade Garden Kurti', 'Mint Fresh Kurti', 'Olive Grace Kurti', 'Sage Wisdom Kurti',
      'Forest Green Kurti', 'Moss Green Kurti', 'Lime Blossom Kurti', 'Teal Tranquility Kurti', 'Pistachio Dreams Kurti'
    ],
    red: [
      'Rani Roop Kurti', 'Lalita Devi Kurti', 'Kumari Kala Kurti', 'Rajni Raga Kurti', 'Surya Kiran Kurti',
      'Rani Devi Kurti', 'Lalita Roop Kurti', 'Kumari Raga Kurti', 'Rajni Kala Kurti', 'Surya Devi Kurti',
      'Crimson Queen Kurti', 'Ruby Radiance Kurti', 'Scarlet Grace Kurti', 'Burgundy Beauty Kurti', 'Cherry Blossom Kurti',
      'Rose Red Kurti', 'Wine Red Kurti', 'Coral Charm Kurti', 'Maroon Majesty Kurti', 'Garnet Glory Kurti'
    ],
    pink: [
      'Gulabi Ganga Kurti', 'Pink Palace Kurti', 'Rose Garden Kurti', 'Kamal Nayan Kurti', 'Pari Priya Kurti',
      'Gulabi Palace Kurti', 'Pink Garden Kurti', 'Rose Nayan Kurti', 'Kamal Priya Kurti', 'Pari Ganga Kurti',
      'Blush Pink Kurti', 'Peach Blossom Kurti', 'Rose Petal Kurti', 'Coral Pink Kurti', 'Dusty Rose Kurti',
      'Magenta Magic Kurti', 'Fuchsia Fantasy Kurti', 'Salmon Silk Kurti', 'Bubblegum Beauty Kurti', 'Cotton Candy Kurti'
    ],
    purple: [
      'Rajni Purple Kurti', 'Neel Kamal Kurti', 'Indira Mahal Kurti', 'Violet Vatika Kurti', 'Purple Palace Kurti',
      'Rajni Violet Kurti', 'Neel Purple Kurti', 'Indira Violet Kurti', 'Violet Palace Kurti', 'Purple Vatika Kurti',
      'Royal Purple Kurti', 'Lavender Dreams Kurti', 'Plum Perfection Kurti', 'Amethyst Aura Kurti', 'Mauve Magic Kurti',
      'Orchid Opulence Kurti', 'Lilac Luxury Kurti', 'Grape Glory Kurti', 'Eggplant Elegance Kurti', 'Violet Velvet Kurti'
    ],
    yellow: [
      'Surya Kiran Kurti', 'Golden Ganga Kurti', 'Chandni Chowk Kurti', 'Sita Surya Kurti', 'Priya Prakash Kurti',
      'Surya Ganga Kurti', 'Golden Kiran Kurti', 'Chandni Surya Kurti', 'Sita Prakash Kurti', 'Priya Chowk Kurti',
      'Sunshine Yellow Kurti', 'Golden Glory Kurti', 'Mustard Magic Kurti', 'Lemon Lime Kurti', 'Buttercup Beauty Kurti',
      'Marigold Majesty Kurti', 'Saffron Silk Kurti', 'Honey Gold Kurti', 'Amber Aura Kurti', 'Citrine Charm Kurti'
    ],
    maroon: [
      'Rajni Raga Kurti', 'Deepa Devi Kurti', 'Kumari Kala Kurti', 'Rani Roop Kurti', 'Lalita Mahal Kurti',
      'Rajni Devi Kurti', 'Deepa Raga Kurti', 'Kumari Roop Kurti', 'Rani Mahal Kurti', 'Lalita Kala Kurti',
      'Burgundy Beauty Kurti', 'Wine Red Kurti', 'Mahogany Magic Kurti', 'Chestnut Charm Kurti', 'Crimson Crown Kurti',
      'Ruby Red Kurti', 'Garnet Glory Kurti', 'Maroon Majesty Kurti', 'Brick Red Kurti', 'Oxblood Opulence Kurti'
    ],
    black: [
      'Kali Mata Kurti', 'Shyam Sundar Kurti', 'Neel Kamal Kurti', 'Indira Sagar Kurti', 'Ganga Jal Kurti',
      'Kali Sundar Kurti', 'Shyam Mata Kurti', 'Neel Kali Kurti', 'Indira Kali Kurti', 'Ganga Mata Kurti',
      'Midnight Black Kurti', 'Ebony Elegance Kurti', 'Onyx Opulence Kurti', 'Raven Beauty Kurti', 'Charcoal Charm Kurti',
      'Jet Black Kurti', 'Obsidian Grace Kurti', 'Coal Beauty Kurti', 'Soot Silk Kurti', 'Pitch Perfect Kurti'
    ],
    white: [
      'Ganga Jal Kurti', 'Chandni Chowk Kurti', 'Sita Van Kurti', 'Priya Prakash Kurti', 'Neel Kamal Kurti',
      'Ganga Chowk Kurti', 'Chandni Jal Kurti', 'Sita Prakash Kurti', 'Priya Van Kurti', 'Neel Ganga Kurti',
      'Pearl White Kurti', 'Ivory Dreams Kurti', 'Snow White Kurti', 'Cream Silk Kurti', 'Milk White Kurti',
      'Alabaster Aura Kurti', 'Chalk White Kurti', 'Bone White Kurti', 'Off White Kurti', 'Vanilla Cream Kurti'
    ],
    multicolor: [
      'Rangoli Raga Kurti', 'Indira Mahal Kurti', 'Rajni Roop Kurti', 'Priya Vatika Kurti', 'Sita Sagar Kurti',
      'Rangoli Mahal Kurti', 'Indira Raga Kurti', 'Rajni Vatika Kurti', 'Priya Sagar Kurti', 'Sita Raga Kurti',
      'Rainbow Radiance Kurti', 'Prism Perfection Kurti', 'Spectrum Silk Kurti', 'Ombre Opulence Kurti', 'Gradient Glory Kurti',
      'Tie Dye Dreams Kurti', 'Color Burst Kurti', 'Vibrant Vision Kurti', 'Hue Harmony Kurti', 'Chroma Charm Kurti'
    ]
  },
  // Crop Top names
  cropTop: {
    blue: [
      'Neel Kamal Crop Top', 'Indira Sagar Crop Top', 'Ganga Jal Crop Top', 'Krishna Neel Crop Top', 'Shyam Sundar Crop Top',
      'Neel Ganga Crop Top', 'Indira Neel Crop Top', 'Krishna Jal Crop Top', 'Shyam Kamal Crop Top', 'Neel Sagar Crop Top',
      'Blue Lotus Crop Top', 'Ocean Blue Crop Top', 'Sky Blue Crop Top', 'Royal Blue Crop Top', 'Midnight Blue Crop Top',
      'Azure Dreams Crop Top', 'Sapphire Silk Crop Top', 'Cobalt Grace Crop Top', 'Navy Elegance Crop Top', 'Turquoise Beauty Crop Top'
    ],
    green: [
      'Hari Priya Crop Top', 'Meera Mal Crop Top', 'Sita Van Crop Top', 'Radha Vatika Crop Top', 'Priya Vana Crop Top',
      'Hari Van Crop Top', 'Meera Vatika Crop Top', 'Sita Priya Crop Top', 'Radha Mal Crop Top', 'Priya Hari Crop Top',
      'Emerald Forest Crop Top', 'Jade Garden Crop Top', 'Mint Fresh Crop Top', 'Olive Grace Crop Top', 'Sage Wisdom Crop Top',
      'Forest Green Crop Top', 'Moss Green Crop Top', 'Lime Blossom Crop Top', 'Teal Tranquility Crop Top', 'Pistachio Dreams Crop Top'
    ],
    red: [
      'Rani Roop Crop Top', 'Lalita Devi Crop Top', 'Kumari Kala Crop Top', 'Rajni Raga Crop Top', 'Surya Kiran Crop Top',
      'Rani Devi Crop Top', 'Lalita Roop Crop Top', 'Kumari Raga Crop Top', 'Rajni Kala Crop Top', 'Surya Devi Crop Top',
      'Crimson Queen Crop Top', 'Ruby Radiance Crop Top', 'Scarlet Grace Crop Top', 'Burgundy Beauty Crop Top', 'Cherry Blossom Crop Top',
      'Rose Red Crop Top', 'Wine Red Crop Top', 'Coral Charm Crop Top', 'Maroon Majesty Crop Top', 'Garnet Glory Crop Top'
    ],
    pink: [
      'Gulabi Ganga Crop Top', 'Pink Palace Crop Top', 'Rose Garden Crop Top', 'Kamal Nayan Crop Top', 'Pari Priya Crop Top',
      'Gulabi Palace Crop Top', 'Pink Garden Crop Top', 'Rose Nayan Crop Top', 'Kamal Priya Crop Top', 'Pari Ganga Crop Top',
      'Blush Pink Crop Top', 'Peach Blossom Crop Top', 'Rose Petal Crop Top', 'Coral Pink Crop Top', 'Dusty Rose Crop Top',
      'Magenta Magic Crop Top', 'Fuchsia Fantasy Crop Top', 'Salmon Silk Crop Top', 'Bubblegum Beauty Crop Top', 'Cotton Candy Crop Top'
    ],
    purple: [
      'Rajni Purple Crop Top', 'Neel Kamal Crop Top', 'Indira Mahal Crop Top', 'Violet Vatika Crop Top', 'Purple Palace Crop Top',
      'Rajni Violet Crop Top', 'Neel Purple Crop Top', 'Indira Violet Crop Top', 'Violet Palace Crop Top', 'Purple Vatika Crop Top',
      'Royal Purple Crop Top', 'Lavender Dreams Crop Top', 'Plum Perfection Crop Top', 'Amethyst Aura Crop Top', 'Mauve Magic Crop Top',
      'Orchid Opulence Crop Top', 'Lilac Luxury Crop Top', 'Grape Glory Crop Top', 'Eggplant Elegance Crop Top', 'Violet Velvet Crop Top'
    ],
    yellow: [
      'Surya Kiran Crop Top', 'Golden Ganga Crop Top', 'Chandni Chowk Crop Top', 'Sita Surya Crop Top', 'Priya Prakash Crop Top',
      'Surya Ganga Crop Top', 'Golden Kiran Crop Top', 'Chandni Surya Crop Top', 'Sita Prakash Crop Top', 'Priya Chowk Crop Top',
      'Sunshine Yellow Crop Top', 'Golden Glory Crop Top', 'Mustard Magic Crop Top', 'Lemon Lime Crop Top', 'Buttercup Beauty Crop Top',
      'Marigold Majesty Crop Top', 'Saffron Silk Crop Top', 'Honey Gold Crop Top', 'Amber Aura Crop Top', 'Citrine Charm Crop Top'
    ],
    maroon: [
      'Rajni Raga Crop Top', 'Deepa Devi Crop Top', 'Kumari Kala Crop Top', 'Rani Roop Crop Top', 'Lalita Mahal Crop Top',
      'Rajni Devi Crop Top', 'Deepa Raga Crop Top', 'Kumari Roop Crop Top', 'Rani Mahal Crop Top', 'Lalita Kala Crop Top',
      'Burgundy Beauty Crop Top', 'Wine Red Crop Top', 'Mahogany Magic Crop Top', 'Chestnut Charm Crop Top', 'Crimson Crown Crop Top',
      'Ruby Red Crop Top', 'Garnet Glory Crop Top', 'Maroon Majesty Crop Top', 'Brick Red Crop Top', 'Oxblood Opulence Crop Top'
    ],
    black: [
      'Kali Mata Crop Top', 'Shyam Sundar Crop Top', 'Neel Kamal Crop Top', 'Indira Sagar Crop Top', 'Ganga Jal Crop Top',
      'Kali Sundar Crop Top', 'Shyam Mata Crop Top', 'Neel Kali Crop Top', 'Indira Kali Crop Top', 'Ganga Mata Crop Top',
      'Midnight Black Crop Top', 'Ebony Elegance Crop Top', 'Onyx Opulence Crop Top', 'Raven Beauty Crop Top', 'Charcoal Charm Crop Top',
      'Jet Black Crop Top', 'Obsidian Grace Crop Top', 'Coal Beauty Crop Top', 'Soot Silk Crop Top', 'Pitch Perfect Crop Top'
    ],
    white: [
      'Ganga Jal Crop Top', 'Chandni Chowk Crop Top', 'Sita Van Crop Top', 'Priya Prakash Crop Top', 'Neel Kamal Crop Top',
      'Ganga Chowk Crop Top', 'Chandni Jal Crop Top', 'Sita Prakash Crop Top', 'Priya Van Crop Top', 'Neel Ganga Crop Top',
      'Pearl White Crop Top', 'Ivory Dreams Crop Top', 'Snow White Crop Top', 'Cream Silk Crop Top', 'Milk White Crop Top',
      'Alabaster Aura Crop Top', 'Chalk White Crop Top', 'Bone White Crop Top', 'Off White Crop Top', 'Vanilla Cream Crop Top'
    ],
    multicolor: [
      'Rangoli Raga Crop Top', 'Indira Mahal Crop Top', 'Rajni Roop Crop Top', 'Priya Vatika Crop Top', 'Sita Sagar Crop Top',
      'Rangoli Mahal Crop Top', 'Indira Raga Crop Top', 'Rajni Vatika Crop Top', 'Priya Sagar Crop Top', 'Sita Raga Crop Top',
      'Rainbow Radiance Crop Top', 'Prism Perfection Crop Top', 'Spectrum Silk Crop Top', 'Ombre Opulence Crop Top', 'Gradient Glory Crop Top',
      'Tie Dye Dreams Crop Top', 'Color Burst Crop Top', 'Vibrant Vision Crop Top', 'Hue Harmony Crop Top', 'Chroma Charm Crop Top'
    ]
  },
  // Kaftan names
  kaftan: {
    blue: [
      'Neel Kamal Kaftan', 'Indira Sagar Kaftan', 'Ganga Jal Kaftan', 'Krishna Neel Kaftan', 'Shyam Sundar Kaftan',
      'Neel Ganga Kaftan', 'Indira Neel Kaftan', 'Krishna Jal Kaftan', 'Shyam Kamal Kaftan', 'Neel Sagar Kaftan',
      'Blue Lotus Kaftan', 'Ocean Blue Kaftan', 'Sky Blue Kaftan', 'Royal Blue Kaftan', 'Midnight Blue Kaftan',
      'Azure Dreams Kaftan', 'Sapphire Silk Kaftan', 'Cobalt Grace Kaftan', 'Navy Elegance Kaftan', 'Turquoise Beauty Kaftan'
    ],
    green: [
      'Hari Priya Kaftan', 'Meera Mal Kaftan', 'Sita Van Kaftan', 'Radha Vatika Kaftan', 'Priya Vana Kaftan',
      'Hari Van Kaftan', 'Meera Vatika Kaftan', 'Sita Priya Kaftan', 'Radha Mal Kaftan', 'Priya Hari Kaftan',
      'Emerald Forest Kaftan', 'Jade Garden Kaftan', 'Mint Fresh Kaftan', 'Olive Grace Kaftan', 'Sage Wisdom Kaftan',
      'Forest Green Kaftan', 'Moss Green Kaftan', 'Lime Blossom Kaftan', 'Teal Tranquility Kaftan', 'Pistachio Dreams Kaftan'
    ],
    red: [
      'Rani Roop Kaftan', 'Lalita Devi Kaftan', 'Kumari Kala Kaftan', 'Rajni Raga Kaftan', 'Surya Kiran Kaftan',
      'Rani Devi Kaftan', 'Lalita Roop Kaftan', 'Kumari Raga Kaftan', 'Rajni Kala Kaftan', 'Surya Devi Kaftan',
      'Crimson Queen Kaftan', 'Ruby Radiance Kaftan', 'Scarlet Grace Kaftan', 'Burgundy Beauty Kaftan', 'Cherry Blossom Kaftan',
      'Rose Red Kaftan', 'Wine Red Kaftan', 'Coral Charm Kaftan', 'Maroon Majesty Kaftan', 'Garnet Glory Kaftan'
    ],
    pink: [
      'Gulabi Ganga Kaftan', 'Pink Palace Kaftan', 'Rose Garden Kaftan', 'Kamal Nayan Kaftan', 'Pari Priya Kaftan',
      'Gulabi Palace Kaftan', 'Pink Garden Kaftan', 'Rose Nayan Kaftan', 'Kamal Priya Kaftan', 'Pari Ganga Kaftan',
      'Blush Pink Kaftan', 'Peach Blossom Kaftan', 'Rose Petal Kaftan', 'Coral Pink Kaftan', 'Dusty Rose Kaftan',
      'Magenta Magic Kaftan', 'Fuchsia Fantasy Kaftan', 'Salmon Silk Kaftan', 'Bubblegum Beauty Kaftan', 'Cotton Candy Kaftan'
    ],
    purple: [
      'Rajni Purple Kaftan', 'Neel Kamal Kaftan', 'Indira Mahal Kaftan', 'Violet Vatika Kaftan', 'Purple Palace Kaftan',
      'Rajni Violet Kaftan', 'Neel Purple Kaftan', 'Indira Violet Kaftan', 'Violet Palace Kaftan', 'Purple Vatika Kaftan',
      'Royal Purple Kaftan', 'Lavender Dreams Kaftan', 'Plum Perfection Kaftan', 'Amethyst Aura Kaftan', 'Mauve Magic Kaftan',
      'Orchid Opulence Kaftan', 'Lilac Luxury Kaftan', 'Grape Glory Kaftan', 'Eggplant Elegance Kaftan', 'Violet Velvet Kaftan'
    ],
    yellow: [
      'Surya Kiran Kaftan', 'Golden Ganga Kaftan', 'Chandni Chowk Kaftan', 'Sita Surya Kaftan', 'Priya Prakash Kaftan',
      'Surya Ganga Kaftan', 'Golden Kiran Kaftan', 'Chandni Surya Kaftan', 'Sita Prakash Kaftan', 'Priya Chowk Kaftan',
      'Sunshine Yellow Kaftan', 'Golden Glory Kaftan', 'Mustard Magic Kaftan', 'Lemon Lime Kaftan', 'Buttercup Beauty Kaftan',
      'Marigold Majesty Kaftan', 'Saffron Silk Kaftan', 'Honey Gold Kaftan', 'Amber Aura Kaftan', 'Citrine Charm Kaftan'
    ],
    maroon: [
      'Rajni Raga Kaftan', 'Deepa Devi Kaftan', 'Kumari Kala Kaftan', 'Rani Roop Kaftan', 'Lalita Mahal Kaftan',
      'Rajni Devi Kaftan', 'Deepa Raga Kaftan', 'Kumari Roop Kaftan', 'Rani Mahal Kaftan', 'Lalita Kala Kaftan',
      'Burgundy Beauty Kaftan', 'Wine Red Kaftan', 'Mahogany Magic Kaftan', 'Chestnut Charm Kaftan', 'Crimson Crown Kaftan',
      'Ruby Red Kaftan', 'Garnet Glory Kaftan', 'Maroon Majesty Kaftan', 'Brick Red Kaftan', 'Oxblood Opulence Kaftan'
    ],
    black: [
      'Kali Mata Kaftan', 'Shyam Sundar Kaftan', 'Neel Kamal Kaftan', 'Indira Sagar Kaftan', 'Ganga Jal Kaftan',
      'Kali Sundar Kaftan', 'Shyam Mata Kaftan', 'Neel Kali Kaftan', 'Indira Kali Kaftan', 'Ganga Mata Kaftan',
      'Midnight Black Kaftan', 'Ebony Elegance Kaftan', 'Onyx Opulence Kaftan', 'Raven Beauty Kaftan', 'Charcoal Charm Kaftan',
      'Jet Black Kaftan', 'Obsidian Grace Kaftan', 'Coal Beauty Kaftan', 'Soot Silk Kaftan', 'Pitch Perfect Kaftan'
    ],
    white: [
      'Ganga Jal Kaftan', 'Chandni Chowk Kaftan', 'Sita Van Kaftan', 'Priya Prakash Kaftan', 'Neel Kamal Kaftan',
      'Ganga Chowk Kaftan', 'Chandni Jal Kaftan', 'Sita Prakash Kaftan', 'Priya Van Kaftan', 'Neel Ganga Kaftan',
      'Pearl White Kaftan', 'Ivory Dreams Kaftan', 'Snow White Kaftan', 'Cream Silk Kaftan', 'Milk White Kaftan',
      'Alabaster Aura Kaftan', 'Chalk White Kaftan', 'Bone White Kaftan', 'Off White Kaftan', 'Vanilla Cream Kaftan'
    ],
    multicolor: [
      'Rangoli Raga Kaftan', 'Indira Mahal Kaftan', 'Rajni Roop Kaftan', 'Priya Vatika Kaftan', 'Sita Sagar Kaftan',
      'Rangoli Mahal Kaftan', 'Indira Raga Kaftan', 'Rajni Vatika Kaftan', 'Priya Sagar Kaftan', 'Sita Raga Kaftan',
      'Rainbow Radiance Kaftan', 'Prism Perfection Kaftan', 'Spectrum Silk Kaftan', 'Ombre Opulence Kaftan', 'Gradient Glory Kaftan',
      'Tie Dye Dreams Kaftan', 'Color Burst Kaftan', 'Vibrant Vision Kaftan', 'Hue Harmony Kaftan', 'Chroma Charm Kaftan'
    ]
  }
};

// Function to detect color from product title
function detectColor(title) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('blue')) return 'blue';
  if (lowerTitle.includes('green')) return 'green';
  if (lowerTitle.includes('red')) return 'red';
  if (lowerTitle.includes('pink')) return 'pink';
  if (lowerTitle.includes('purple')) return 'purple';
  if (lowerTitle.includes('yellow')) return 'yellow';
  if (lowerTitle.includes('maroon')) return 'maroon';
  if (lowerTitle.includes('black')) return 'black';
  if (lowerTitle.includes('white')) return 'white';
  if (lowerTitle.includes('multicolor') || lowerTitle.includes('multi')) return 'multicolor';
  return 'multicolor'; // default
}

// Function to detect product type from subcategory
function detectProductType(subcategory) {
  if (!subcategory) return 'kurti';
  const slug = subcategory.slug;
  if (slug.includes('saree')) return 'saree';
  if (slug.includes('kaftan')) return 'kaftan';
  if (slug.includes('crop-top')) return 'cropTop';
  return 'kurti'; // default
}

// Function to get unique relatable name
function getUniqueRelatableName(product, usedNames) {
  const productType = detectProductType(product.subcategory);
  const color = detectColor(product.title);
  const nameArray = indianNames[productType][color] || indianNames[productType]['multicolor'];
  
  // Find a name that hasn't been used yet
  for (let i = 0; i < nameArray.length; i++) {
    const name = nameArray[i];
    if (!usedNames.has(name)) {
      usedNames.add(name);
      return name;
    }
  }
  
  // If all names are used, create a unique variation with descriptive words
  const baseName = nameArray[0];
  const descriptiveWords = ['Elegant', 'Graceful', 'Radiant', 'Charming', 'Divine', 'Exquisite', 'Lovely', 'Beautiful', 'Stunning', 'Gorgeous'];
  const uniqueWords = ['Classic', 'Modern', 'Traditional', 'Contemporary', 'Vintage', 'Trendy', 'Chic', 'Stylish', 'Fashionable', 'Sophisticated'];
  
  let counter = 1;
  let uniqueName = `${descriptiveWords[counter % descriptiveWords.length]} ${baseName}`;
  while (usedNames.has(uniqueName)) {
    counter++;
    uniqueName = `${uniqueWords[counter % uniqueWords.length]} ${baseName}`;
  }
  usedNames.add(uniqueName);
  return uniqueName;
}

// Track used names to ensure uniqueness
const usedNames = new Set();

// Update products that belong to clothing category
const updatedProducts = products.map(product => {
  // Check if product belongs to clothing category
  if (product.category && product.category.slug === 'clothing') {
    const currentTitle = product.title;
    const relatableName = getUniqueRelatableName(product, usedNames);
    
    if (currentTitle !== relatableName) {
      updatedCount++;
      console.log(`📝 Updating: "${currentTitle}" → "${relatableName}"`);
      
      return {
        ...product,
        title: relatableName,
        slug: generateSlug(relatableName),
        updatedAt: new Date().toISOString()
      };
    }
  }
  return product;
});

// Write updated products file
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

console.log(`\n✅ Updated ${updatedCount} clothing products with unique relatable Indian names`);
console.log(`📊 Total products: ${updatedProducts.length}`);

// Show sample of updated products
const clothingProducts = updatedProducts.filter(p => p.category && p.category.slug === 'clothing');
console.log(`\n🎯 Sample Updated Clothing Products:`);
clothingProducts.slice(0, 10).forEach(p => {
  console.log(`   - ${p.title} (${p.sku}) - ₹${p.price}`);
});

// Check for duplicates
const names = clothingProducts.map(p => p.title);
const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
console.log(`\n🔍 Duplicate names found: ${[...new Set(duplicates)].length}`);

console.log('\n🎉 Clothing product names updated with unique relatable Indian names!');
