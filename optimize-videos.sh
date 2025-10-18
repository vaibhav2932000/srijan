#!/bin/bash

# Video optimization script
# This script compresses videos while maintaining good quality

echo "🎬 Starting video optimization..."

# Create backup directory
mkdir -p public/video-backups
echo "📁 Created backup directory"

# Function to optimize video
optimize_video() {
    local input="$1"
    local output="$2"
    local max_size_mb="$3"
    
    echo "🔄 Optimizing $input..."
    
    # Get original size
    original_size=$(du -m "$input" | cut -f1)
    echo "📊 Original size: ${original_size}MB"
    
    # Calculate target bitrate based on desired file size
    # Formula: bitrate = (target_size_mb * 8 * 1000) / duration_seconds
    duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$input")
    target_bitrate=$((max_size_mb * 8 * 1000 / ${duration%.*}))
    
    # Ensure minimum bitrate for quality
    if [ $target_bitrate -lt 500 ]; then
        target_bitrate=500
    fi
    
    echo "🎯 Target bitrate: ${target_bitrate}k"
    
    # Optimize video with H.264 codec, optimized for web
    ffmpeg -i "$input" \
        -c:v libx264 \
        -crf 23 \
        -preset medium \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
        -y \
        "$output"
    
    if [ $? -eq 0 ]; then
        new_size=$(du -m "$output" | cut -f1)
        reduction=$((original_size - new_size))
        echo "✅ Optimized: ${original_size}MB → ${new_size}MB (saved ${reduction}MB)"
    else
        echo "❌ Failed to optimize $input"
        return 1
    fi
}

# Backup original videos
echo "💾 Backing up original videos..."
cp public/*.mp4 public/video-backups/ 2>/dev/null || true
cp public/*.mov public/video-backups/ 2>/dev/null || true

# Optimize each video with different size targets
echo "🚀 Starting optimization process..."

# Large videos - target 10-15MB
optimize_video "public/Clothing.mp4" "public/Clothing_optimized.mp4" 12
optimize_video "public/jewelery.mp4" "public/jewelery_optimized.mp4" 12
optimize_video "public/handicraft.mp4" "public/handicraft_optimized.mp4" 10
optimize_video "public/bedsheet.mp4" "public/bedsheet_optimized.mp4" 8

# Medium videos - target 5-8MB
optimize_video "public/Video3.mov" "public/Video3_optimized.mp4" 6
optimize_video "public/movie2.mov" "public/movie2_optimized.mp4" 6
optimize_video "public/hey.mov" "public/hey_optimized.mp4" 5

# Small videos - keep as is or slight optimization
optimize_video "public/logo.mp4" "public/logo_optimized.mp4" 1

echo "🎉 Video optimization complete!"
echo "📊 Summary:"
echo "Original total size: $(du -sh public/video-backups/ | cut -f1)"
echo "Optimized total size: $(du -sh public/*_optimized.mp4 | cut -f1)"

echo ""
echo "🔄 Replacing original files with optimized versions..."
mv public/Clothing_optimized.mp4 public/Clothing.mp4
mv public/jewelery_optimized.mp4 public/jewelery.mp4
mv public/handicraft_optimized.mp4 public/handicraft.mp4
mv public/bedsheet_optimized.mp4 public/bedsheet.mp4
mv public/Video3_optimized.mp4 public/Video3.mp4
mv public/movie2_optimized.mp4 public/movie2.mp4
mv public/hey_optimized.mp4 public/hey.mp4
mv public/logo_optimized.mp4 public/logo.mp4

echo "✅ All videos have been optimized and replaced!"
echo "💾 Original files backed up in public/video-backups/"
