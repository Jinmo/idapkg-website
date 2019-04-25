# Getting started

First, install [idapkg](https://github.com/Jinmo/idapkg) for installing the packages.

## Packaging plugins

The package format is same as IDA loads the plugin, except `info.json`. See [`IDAUSR` variable](https://www.hex-rays.com/products/ida/support/idadoc/1375.shtml).

```diff
Required:
+   info.json

Optional for IDA:
+   plugins/
       ...
+   procs/
       ...
+   loaders/
       ...
+   til/ sig/ ids/
       ...

Optional for package:
+   README.md
```

### 1. plugins/ : Plugins directory

... and procs/ has processor modules, loaders/ has loader modules. Extension is important:

- .py: idapython
- .dll/dylib/so: native plugins
  - 64.dll/64.dylib/64.so: native plugins for EA64
- .idc: idc

Type libraries, FLIRT signatures, and known function types can be bundled into til/ sig/ ids/. Please note that these directories are also in IDA Pro's installed folder.

### 2. info.json (required)

You can bundle your IDA plugin with `info.json`, and `README.md` (if needed).

```javascript
{
    "_id": "my-plugin",
    "name": "Community Headers",
    "version": "1.0.0",
    "description": "Loads C/C++ header from online"
}
```

### 3. README.md

```markdown
My Plugin
===

Awesome description here.
```

## Uploading the package

[Finally, you can make a zip of the directory and upload your package at /upload](/upload). The package can be managed via the repo.

# details on `info.json`

\_id (actual path), name, version, description are needed.

## installers: Installation scripts (optional)

```javascript
"installers": [
    "installers/pip.py"
]
```

They must be python scripts. The entries are executed in order.

Before execution, `os.chdir(package_root)` is done. `__file__` is also provided.
Raise exception to abort installation, and the files will be removed.

For installing pip packages, see below.

### Example: Python dependencies

idapkg creates and uses virtualenv at `~/idapkg/python.` pip for this env is available.

```python
import os
import pkg.env as env

if env.os == 'linux' and env.version < 7:
    assert not os.system('apt-get install -y php7.2-cli') # Bonus!

assert not os.system('pip install -r requirements.txt')

```

`pkg.env` module is from idapkg, and it has useful variables too.

- `env.os`: operating system, one of ('win', 'mac', 'linux')
- `env.ea`: current ea, one of (32, 64)
- `env.version`: python Decimal object for IDA Pro's version (ex. `Decimal(6.95)`)
- `env.version_info`: namedtuple with version details (ex. `VersionPair(major=7, minor=0, micro=171130)`)

For `pkg.*` references, see [API docs](/not-yet).

## dependencies: Dependencies between packages (optional)

A package can have dependency list. The loading order is also sorted regarding to dependencies.

```javascript
"dependencies": {
    "ifred": "*"
}
```

## homepage: Your project homepage (optional)

Add website to package information page.

```javascript
"homepage": "https://your_site.com"
```

# Additional notes

`idapkg/packages` is added to `sys.path` at startup, so placing `__init__.py` enables importing your packages in IDAPython.