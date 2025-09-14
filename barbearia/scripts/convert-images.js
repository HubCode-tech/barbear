/**
 * Script para converter imagens para WebP
 * Requer Node.js e as dependências: sharp
 * Instale com: npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configurações
const config = {
    inputDir: '../assets/img',
    outputDir: '../assets/img',
    quality: 80, // Qualidade do WebP (0-100)
    sizes: [
        { width: 300, suffix: '-sm' },
        { width: 600, suffix: '-md' },
        { width: 1200, suffix: '-lg' }
    ],
    extensions: ['.jpg', '.jpeg', '.png']
};

// Função para criar diretório se não existir
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Diretório criado: ${directory}`);
    }
}

// Função para converter uma imagem para WebP
async function convertToWebP(inputPath, outputPath, width, quality) {
    try {
        await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality })
            .toFile(outputPath);
        
        console.log(`Convertido: ${outputPath}`);
    } catch (error) {
        console.error(`Erro ao converter ${inputPath}:`, error);
    }
}

// Função para processar um arquivo
async function processFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    if (!config.extensions.includes(ext)) {
        return;
    }
    
    const fileName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const relativeDirName = path.relative(config.inputDir, dirName);
    const outputDirName = path.join(config.outputDir, relativeDirName);
    
    ensureDirectoryExists(outputDirName);
    
    // Criar versão WebP original (mesma resolução)
    const outputPath = path.join(outputDirName, `${fileName}.webp`);
    await convertToWebP(filePath, outputPath, null, config.quality);
    
    // Criar versões redimensionadas
    for (const size of config.sizes) {
        const resizedOutputPath = path.join(outputDirName, `${fileName}${size.suffix}.webp`);
        await convertToWebP(filePath, resizedOutputPath, size.width, config.quality);
    }
}

// Função para percorrer diretórios recursivamente
async function processDirectory(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (entry.isFile()) {
            await processFile(fullPath);
        }
    }
}

// Função principal
async function main() {
    console.log('Iniciando conversão de imagens para WebP...');
    
    try {
        ensureDirectoryExists(config.outputDir);
        await processDirectory(config.inputDir);
        console.log('Conversão concluída com sucesso!');
    } catch (error) {
        console.error('Erro durante a conversão:', error);
    }
}

// Executar o script
main();