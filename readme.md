# tinyhtmlparser

学习了winter老师的《重学前端 | <11 | 浏览器：一个浏览器是如何工作的？（阶段二）>》做的一个简单的`html`编译器

## 编译过程

图来自[此处](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn)

![full-process](./media/full-process.png)

### 词法分析图

![lexicalParser.svg](./media/lexicalParser.svg)

## Example

```html
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <p>hello world</p>
  <input class="input" foucus/>
  <button onclick='alert("asd");'>asd</button>
</body>
</html>
```

Html to DOM tree

```json
{
  "nodeType": 9,
  "childNodes": [
    {
      "nodeType": 1,
      "tagName": "html",
      "childNodes": [
        {
          "nodeType": 3,
          "data": "\n"
        },
        {
          "nodeType": 1,
          "tagName": "head",
          "childNodes": [
            {
              "nodeType": 3,
              "data": "\n  "
            },
            {
              "nodeType": 1,
              "tagName": "title",
              "childNodes": [
                {
                  "nodeType": 3,
                  "data": "Page Title"
                }
              ]
            },
            {
              "nodeType": 3,
              "data": "\n"
            }
          ]
        },
        {
          "nodeType": 3,
          "data": "\n"
        },
        {
          "nodeType": 1,
          "tagName": "body",
          "childNodes": [
            {
              "nodeType": 3,
              "data": "\n  "
            },
            {
              "nodeType": 1,
              "tagName": "p",
              "childNodes": [
                {
                  "nodeType": 3,
                  "data": "hello world"
                }
              ]
            },
            {
              "nodeType": 3,
              "data": "\n  "
            },
            {
              "nodeType": 1,
              "tagName": "input",
              "childNodes": [],
              "class": "input",
              "foucus": ""
            },
            {
              "nodeType": 3,
              "data": "\n  "
            },
            {
              "nodeType": 1,
              "tagName": "button",
              "childNodes": [
                {
                  "nodeType": 3,
                  "data": "asd"
                }
              ],
              "onclick": "alert(\"asd\");"
            },
            {
              "nodeType": 3,
              "data": "\n"
            }
          ]
        },
        {
          "nodeType": 3,
          "data": "\n"
        }
      ]
    }
  ]
}
```
