/**
 * Script para otimizar imagens existentes
 * Requer Node.js e as dependências: sharp
 * Instale com: npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configurações
const config = {
    inputDir: '../assets/img',
    outputDir: '../assets/img/optimized',
    quality: {
        jpeg: 80,
        png: 80,
        webp: 75
    },
    extensions: ['.jpg', '.jpeg', '.png', '.webp']
};

// Função para criar diretório se não existir
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Diretório criado: ${directory}`);
    }
}

// Função para otimizar uma imagem
async function optimizeImage(inputPath, outputPath) {
    try {
        const ext = path.extname(inputPath).toLowerCase();
        let sharpInstance = sharp(inputPath);
        
        // Aplicar configurações específicas com base na extensão
        if (ext === '.jpg' || ext === '.jpeg') {
            sharpInstance = sharpInstance.jpeg({ quality: config.quality.jpeg });
        } else if (ext === '.png') {
            sharpInstance = sharpInstance.png({ quality: config.quality.png });
        } else if (ext === '.webp') {
            sharpInstance = sharpInstance.webp({ quality: config.quality.webp });
        }
        
        // Obter informações da imagem original
        const metadata = await sharp(inputPath).metadata();
        const originalSize = fs.statSync(inputPath).size;
        
        // Salvar a imagem otimizada
        await sharpInstance.toFile(outputPath);
        
        // Obter tamanho da imagem otimizada
        const optimizedSize = fs.statSync(outputPath).size;
        const savings = originalSize - optimizedSize;
        const savingsPercentage = (savings / originalSize) * 100;
        
        console.log(`Otimizado: ${path.basename(inputPath)}`);
        console.log(`  Dimensões: ${metadata.width}x${metadata.height}`);
        console.log(`  Tamanho original: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`  Tamanho otimizado: ${(optimizedSize / 1024).toFixed(2)} KB`);
        console.log(`  Economia: ${(savings / 1024).toFixed(2)} KB (${savingsPercentage.toFixed(2)}%)`);
        console.log('-----------------------------------');
    } catch (error) {
        console.error(`Erro ao otimizar ${inputPath}:`, error);
    }
}

// Função para processar um arquivo
async function processFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    if (!config.extensions.includes(ext)) {
        return;
    }
    
    const fileName = path.basename(filePath);
    const dirName = path.dirname(filePath);
    const relativeDirName = path.relative(config.inputDir, dirName);
    const outputDirName = path.join(config.outputDir, relativeDirName);
    
    ensureDirectoryExists(outputDirName);
    
    const outputPath = path.join(outputDirName, fileName);
    await optimizeImage(filePath, outputPath);
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
    console.log('Iniciando otimização de imagens...');
    console.log('-----------------------------------');
    
    try {
        ensureDirectoryExists(config.outputDir);
        await processDirectory(config.inputDir);
        
        console.log('-----------------------------------');
        console.log('Otimização concluída com sucesso!');
    } catch (error) {
        console.error('Erro durante a otimização:', error);
    }
}

// Executar o script
main();