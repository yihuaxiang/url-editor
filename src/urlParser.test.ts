import { URLParser } from './urlParser';

// 简单的测试函数
function testURLParser() {
  console.log('🧪 开始测试 URL 解析器...');
  
  // 测试基本 URL 解析
  const testURL = 'https://example.com:8080/path/to/resource?param1=value1&param2=value2#section';
  const parsed = URLParser.parseURL(testURL);
  
  console.log('✅ 测试 URL:', testURL);
  console.log('✅ 解析结果:', parsed);
  
  // 测试 URL 构建
  const rebuilt = URLParser.buildURL(parsed.parts, parsed.queryParams);
  console.log('✅ 重建 URL:', rebuilt);
  
  // 测试查询参数管理
  const newParams = URLParser.addQueryParam(parsed.queryParams);
  console.log('✅ 添加参数后:', newParams);
  
  const removedParams = URLParser.removeQueryParam(newParams, newParams[newParams.length - 1].id);
  console.log('✅ 删除参数后:', removedParams);
  
  console.log('🎉 所有测试完成！');
}

// 在浏览器环境中运行测试
if (typeof window !== 'undefined') {
  testURLParser();
}

export { testURLParser };
