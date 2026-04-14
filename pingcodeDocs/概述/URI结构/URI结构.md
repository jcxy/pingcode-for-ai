# URI结构

PingCode REST API通过URI路径提供对资源的访问，使用`{}`将URI路径的一部分标记为可使用参数替换的部分，URI路径遵循以下规则：
 https://rest_api_root/v1[/{area}]/{resource}
` 
例如：
 https://open.pingcode.com/v1/scm/products
https://open.pingcode.com/v1/scm/products/{product_id}/repositories
https://open.pingcode.com/v1/release/environments
` 
`rest_api_root`表示REST API的根路径，在不同的环境中rest_api_root值有所不同：
 公有云环境的rest_api_root值为：https://open.pingcode.com
私有部署环境的rest_api_root值为：https://xxxxxx/open
` 
`oauth2_root`表示OAuth2页面的根路径，在不同的环境中oauth2_root值也有所不同：
 公有云环境的oauth2_root值为：https://open.pingcode.com/oauth2
私有部署环境的oauth2_root值为：https://xxxxxx/oauth2
`
