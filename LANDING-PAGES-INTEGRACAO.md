# Integração de landing pages por subdomínio

A aplicação mantém as rotas atuais no domínio principal e mostra uma landing page quando acessada por um subdomínio direto, por exemplo `vanialuxo.tudosobreap.com.br`.

## Como funciona

- O subdomínio é identificado pelo navegador.
- A aplicação consulta `REACT_APP_API_URL` em `/landing-pages?status=published&filters[subdominio][$eq]=SUBDOMINIO&populate[imagemTopo]=true&populate[cardsConteudo1][populate]=*&pagination[pageSize]=100`.
- A consulta utiliza a API pública do Strapi já configurada no projeto.
- Imagens relativas do Strapi são resolvidas usando a origem derivada de `REACT_APP_API_URL`.
- Para testar localmente, execute `npm start` e abra `http://localhost:3000/?landing=vanialuxo`.

## Antes de publicar

1. Confirme que a landing page está publicada no Strapi e que o campo `subdominio` corresponde ao prefixo do endereço (por exemplo, `vanialuxo`).
2. Confirme que a API pública permite leitura da coleção `landing-pages` e dos arquivos de mídia.
3. Configure DNS e hospedagem para que os subdomínios apontem para a mesma aplicação React. O código React não cria DNS nem subdomínios no Hostinger.
4. Faça o build com `npm run homolog_build` usando a configuração de ambiente correta para produção.

O componente apresenta título, subtítulo, descrição, imagem de topo, logo, cards de conteúdo e galeria quando esses campos existem. Como os campos dos componentes repetíveis podem variar conforme o schema do Strapi, confira a renderização com uma landing page publicada real.


## Testar a landing page com o Strapi local

A configuração padrão `REACT_APP_API_URL` continua apontando para o ambiente já configurado (produção/Cloud). Para testar os dados locais, foi adicionada a variável `REACT_APP_API_URL_LOCAL=http://localhost:1337/api/` no `.env.development`.

Com o React e o Strapi local em execução, acesse:

`http://localhost:3000/?landing=vanialuxo&local=true`

O parâmetro `local=true` seleciona a variável `REACT_APP_API_URL_LOCAL` somente nessa visualização. Sem esse parâmetro, o frontend continua usando `REACT_APP_API_URL`. Depois de editar variáveis de ambiente, reinicie o servidor React. Não use `local=true` em produção, pois `localhost` se refere ao computador de cada visitante.
