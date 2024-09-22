hexo.extend.filter.register('before_post_render', function(data) {
    const config = hexo.config.hexo_auto_photos || {};
    
    // 判断插件是否启用
    if (!config.enable) {
      return data;
    }
  
    // 如果用户已经定义了 photos 字段，跳过自动提取
    if (data.photos && data.photos.length > 0) {
      return data;
    }
  
    const photos = [];
    
    // 匹配 Markdown 图片格式 ![alt text](image_url "optional title")
    const markdownRegex = /!\[.*?\]\((.*?)\)/g;
    
    // 匹配 HTML img 标签格式 <img src="image_url" ... >
    const htmlRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  
    let match;
  
    // 提取 Markdown 图片 URL
    while ((match = markdownRegex.exec(data.content)) !== null) {
      photos.push(match[1]);
      // 如果达到了配置中的最大数量，则停止提取
      if (config.max && photos.length >= config.max) {
        break;
      }
    }
  
    // 如果未达到最大数量，继续提取 HTML img 标签中的图片 URL
    if (!config.max || photos.length < config.max) {
      while ((match = htmlRegex.exec(data.content)) !== null) {
        photos.push(match[1]);
        if (config.max && photos.length >= config.max) {
          break;
        }
      }
    }
  
    // 如果有图片，则将其添加到 photos 字段
    if (photos.length > 0) {
      data.photos = photos;
    }
  
    return data;
  });
  