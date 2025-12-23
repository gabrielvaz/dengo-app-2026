# Play Store - Pacote e envio

## Arquivos gerados (local)
- AAB: `playstore-release/dengo-release.aab`
- Keystore: `playstore-release/dengo-release.keystore` (nao vai para o Git)
- Senhas do keystore: `playstore-release/keystore-info.txt` (nao vai para o Git)
- Credenciais locais do EAS: `credentials.json` (nao vai para o Git)

## Build local (gerar novo AAB)
1. Garanta Java 17 instalado.
2. Garanta que `credentials.json` existe no root do projeto e aponta para o keystore.
3. Rode o build:

```
JAVA_HOME="$PWD/tools/jdk-17.0.12+7/Contents/Home" \
PATH="$PWD/tools/jdk-17.0.12+7/Contents/Home/bin:$PATH" \
  npx eas-cli build -p android --profile production --local --non-interactive \
  --output playstore-release/dengo-release.aab
```

Se preferir, use o Java do sistema e remova o `JAVA_HOME` do comando.

## Submissao no Play Console
- Criar release (Production ou Internal testing)
- Fazer upload do AAB
- Preencher Data Safety com `app-release/05-legal/data-safety-playstore.md`
- Preencher Content Rating (IARC) como app para adultos
- Definir politica de privacidade (URL publica)
- App access: sem login necessario
- Adicionar screenshots e feature graphic (ver `app-release/03-screenshots`)

## Notas importantes
- Guarde o keystore e as senhas em local seguro. Sem isso nao sera possivel atualizar o app.
- Para novas versoes, atualize `app.json` (`version` e `android.versionCode`).
- Se mudar URLs legais, atualizar `app.json` em `extra.legal` e o Play Console.
