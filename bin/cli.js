#! /usr/bin/env node

const RESET = '\x1b[0m'
const CYAN = '\x1b[36m'
const ORANGE = '\x1b[38;2;255;165;0m'
const GOLD = '\x1b[38;2;255;215;0m'

const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

const runCommand = (command) => {
	try {
		execSync(`${command}`, { stdio: 'inherit' })
	} catch (error) {
		console.error(`Failed to execute ${command}`, error)
		return false
	}
	return true
}

let repoName = process.argv[2]
if (!repoName) {
	console.clear()
	rl.question(`${CYAN}Enter the name of your project:${RESET}`, (name) => {
		repoName = name.trim()
		cloneAndInstall(repoName)
		rl.close()
	})
} else {
	cloneAndInstall(repoName)
}

function cloneAndInstall(repoName) {
	const gitCheckoutCommand = `git clone --depth 1 https://github.com/valyy151/valy-launcher ${repoName}`
	const installDepsCommand = `cd ${repoName} && npm install`
	console.clear()

	const checkedOutput = runCommand(gitCheckoutCommand)

	if (!checkedOutput) {
		console.clear()
		console.error('\x1b[31mFailed to clone into repo\x1b[0m')
		process.exit(1)
	}

	console.log(`${ORANGE}Installing dependencies...${RESET}`)

	const installedDeps = runCommand(installDepsCommand)
	if (!installedDeps) {
		process.exit(1)
	}
	console.clear()
	console.log(`${GOLD}Done! Now do the following to start development:${RESET}`)
	console.log(`${ORANGE}cd ${repoName} && npm run dev${RESET}`)
}
