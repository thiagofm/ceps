var express, http, pg, db;

pg = require('pg');
express = require('express');

http = express();
http.use(express.logger());

db = new pg.Client(process.env.DATABASE_URL);
db.connect();

http.get('/cep/:cep_number', function(request, response) {
  var q;

  q = 'SELECT LG."CEP", LB."BAI_NO", LC."LOC_NO", LG."UFE_SG", LG."TLO_TX", LG."LOG_NO" FROM "LOG_LOGRADOURO" LG LEFT JOIN "LOG_LOCALIDADE" LC ON LC."LOC_NU" = LG."LOC_NU" LEFT JOIN "LOG_BAIRRO" LB ON LG."BAI_NU_INI" = LB."BAI_NU" WHERE LG."CEP" = $1 LIMIT 1;';

  db.query(q, [request.params.cep_number], function(error, result) {
    response.json(error || result.rows);
  });
});

http.listen(process.env.PORT);
