# official Playwright image, same version as @playwright/test in package.json:
# when Playwright is updated, update the tag and the digest here too
FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:7852dc5a7d72f5fe458a597d690f6c42fbc8e9e26ddfa95f8e6ef552558d9bbf

WORKDIR /app
RUN chown pwuser:pwuser /app
USER pwuser

COPY --chown=pwuser:pwuser package.json package-lock.json ./
RUN npm ci

COPY --chown=pwuser:pwuser . .

CMD ["npm", "test"]
